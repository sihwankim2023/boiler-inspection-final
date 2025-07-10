import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, ArrowLeft, Check, X } from 'lucide-react'

interface InspectionForm {
  inspectionDate: string
  inspector: string
  siteName: string
  city: string
  district: string
  result: string
  summary: string
  products: Array<{name: string, count: number}>
}

const cityData = {
  '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '경기도': ['수원시', '성남시', '안양시', '안산시', '용인시', '광명시', '평택시', '과천시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '이천시', '안성시', '김포시', '화성시', '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군'],
  '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '부산광역시': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구광역시': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
}

const productList = [
  { name: 'NPW-351K', label: 'NPW-351K (온수보일러)' },
  { name: 'NCN-45HD', label: 'NCN-45HD (콘덴싱보일러)' },
  { name: 'NCB790', label: 'NCB790 (콘덴싱보일러)' },
  { name: 'NFB-500', label: 'NFB-500 (온수보일러)' }
]

const checklistItems = [
  { id: 'burner_nozzle', label: '버너 노즐 상태 확인', category: '설치' },
  { id: 'ignition_electrode', label: '점화 전극 상태 확인', category: '설치' },
  { id: 'flame_sensor', label: '화염 감지기 상태 확인', category: '설치' },
  { id: 'gas_valve', label: '가스 밸브 작동 확인', category: '설치' },
  { id: 'air_damper', label: '공기 댐퍼 조절 확인', category: '설치' },
  { id: 'heat_exchanger', label: '열교환기 청소 상태 확인', category: '설치' },
  { id: 'exhaust_pipe', label: '배기관 연결 상태 확인', category: '설치' },
  { id: 'insulation', label: '보온재 설치 상태 확인', category: '설치' },
  { id: 'drain_valve', label: '드레인 밸브 작동 확인', category: '설치' },
  { id: 'pressure_gauge', label: '압력계 정상 작동 확인', category: '설치' },
  { id: 'temperature_gauge', label: '온도계 정상 작동 확인', category: '설치' },
  { id: 'safety_valve', label: '안전밸브 작동 확인', category: '설치' },
  { id: 'water_level', label: '수위 조절 장치 확인', category: 'Check' },
  { id: 'circulation_pump', label: '순환펌프 작동 확인', category: 'Check' },
  { id: 'expansion_tank', label: '팽창탱크 상태 확인', category: 'Check' },
  { id: 'direct_return_filter', label: '직수환수급기필터 상태 확인', category: 'Check' },
  { id: 'blower', label: '송풍기 작동 상태 확인', category: 'Check' },
  { id: 'dual_venturi', label: '듀얼벤츄리 작동 확인', category: 'Check' },
  { id: 'pump', label: '펌프 작동 상태 확인', category: 'Check' },
  { id: 'mixing_valve', label: '믹싱밸브 작동 확인', category: 'Check' },
  { id: 'three_way_valve', label: '삼방밸브 작동 확인', category: 'Check' },
  { id: 'control_panel', label: '제어반 작동 확인', category: 'Check' },
  { id: 'overall_system', label: '전체 시스템 통합 작동 확인', category: 'Check' }
]

export default function InspectionPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<InspectionForm>({
    inspectionDate: new Date().toISOString().split('T')[0],
    inspector: '',
    siteName: '',
    city: '',
    district: '',
    result: '',
    summary: '',
    products: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [checklistAnswers, setChecklistAnswers] = useState<Record<string, {answer: string, reason: string}>>({})
  const [showProductForm, setShowProductForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [productCount, setProductCount] = useState(1)

  const handleInputChange = (field: keyof InspectionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addProduct = () => {
    if (selectedProduct && productCount > 0) {
      const newProduct = { name: selectedProduct, count: productCount }
      setFormData(prev => ({ ...prev, products: [...prev.products, newProduct] }))
      setSelectedProduct('')
      setProductCount(1)
      setShowProductForm(false)
    }
  }

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }))
  }

  const updateChecklistAnswer = (itemId: string, answer: string, reason: string = '') => {
    setChecklistAnswers(prev => ({
      ...prev,
      [itemId]: { answer, reason }
    }))
  }

  const setAllYes = () => {
    const allYes = checklistItems.reduce((acc, item) => {
      acc[item.id] = { answer: 'yes', reason: '' }
      return acc
    }, {} as Record<string, {answer: string, reason: string}>)
    setChecklistAnswers(allYes)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const newInspection = {
        id: Date.now().toString(),
        inspection_date: formData.inspectionDate,
        inspector: formData.inspector,
        site_name: formData.siteName,
        address: `${formData.city} ${formData.district}`,
        result: formData.result,
        summary: formData.summary,
        products: formData.products,
        checklist_answers: checklistAnswers,
        created_at: new Date().toISOString()
      }
      
      const existingData = localStorage.getItem('inspections')
      const inspections = existingData ? JSON.parse(existingData) : []
      inspections.unshift(newInspection)
      localStorage.setItem('inspections', JSON.stringify(inspections))
      
      // 보고서 생성
      const totalProducts = formData.products.reduce((sum, p) => sum + p.count, 0)
      const reportContent = `보일러 점검 보고서

========================================
점검 기본 정보
========================================
점검일: ${formData.inspectionDate}
점검자: ${formData.inspector}
현장명: ${formData.siteName}
주소: ${formData.city} ${formData.district}
점검 결과: ${formData.result}

========================================
설치 제품 정보
========================================
${formData.products.map(p => `${p.name}: ${p.count}대`).join('\n')}
총 설치 대수: ${totalProducts}대

========================================
점검 체크리스트 결과
========================================

[설치 항목 - 12개]
${checklistItems.filter(item => item.category === '설치').map(item => {
  const answer = checklistAnswers[item.id]
  const status = answer?.answer === 'yes' ? '✓ 정상' : answer?.answer === 'no' ? '✗ 불량' : '○ 미확인'
  const reason = answer?.reason ? ` (사유: ${answer.reason})` : ''
  return `${item.label}: ${status}${reason}`
}).join('\n')}

[점검 항목 - 11개]
${checklistItems.filter(item => item.category === 'Check').map(item => {
  const answer = checklistAnswers[item.id]
  const status = answer?.answer === 'yes' ? '✓ 정상' : answer?.answer === 'no' ? '✗ 불량' : '○ 미확인'
  const reason = answer?.reason ? ` (사유: ${answer.reason})` : ''
  return `${item.label}: ${status}${reason}`
}).join('\n')}

========================================
점검 요약
========================================
${formData.summary || '점검 요약이 입력되지 않았습니다.'}

========================================
보고서 생성 정보
========================================
생성 시간: ${new Date().toLocaleString('ko-KR')}
시스템: 보일러 점검 관리 시스템 v1.0
      `
      
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `점검보고서_${formData.siteName}_${formData.inspectionDate}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('점검이 완료되고 보고서가 다운로드되었습니다!')
      navigate('/')
      
    } catch (error) {
      console.error('점검 저장 실패:', error)
      alert('점검 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableDistricts = cityData[formData.city as keyof typeof cityData] || []
  const totalAnswered = Object.keys(checklistAnswers).length
  const totalItems = checklistItems.length

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600">보일러 점검</h1>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            <span>홈으로</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">점검 정보</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">점검일</label>
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">점검자</label>
                <input
                  type="text"
                  value={formData.inspector}
                  onChange={(e) => handleInputChange('inspector', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="점검자 이름"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">현장명</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="현장명"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">점검 결과</label>
                <select
                  value={formData.result}
                  onChange={(e) => handleInputChange('result', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">선택</option>
                  <option value="정상">정상</option>
                  <option value="주의">주의</option>
                  <option value="불량">불량</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">설치 위치</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시/도</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">선택</option>
                  {Object.keys(cityData).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">구/군</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.city}
                  required
                >
                  <option value="">선택</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">설치 제품</h2>
            
            {formData.products.length > 0 && (
              <div className="mb-4">
                <div className="space-y-2">
                  {formData.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div>
                        <span className="font-medium">{product.name}</span>
                        <span className="text-gray-600 ml-2">{product.count}대</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <span className="text-blue-800 font-medium">
                    총 {formData.products.reduce((sum, p) => sum + p.count, 0)}대 설치
                  </span>
                </div>
              </div>
            )}

            {showProductForm ? (
              <div className="bg-white p-4 rounded border">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제품 선택</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">선택</option>
                      {productList.map(product => (
                        <option key={product.name} value={product.name}>{product.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">설치 대수</label>
                    <input
                      type="number"
                      min="1"
                      value={productCount}
                      onChange={(e) => setProductCount(parseInt(e.target.value) || 1)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowProductForm(true)}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
              >
                제품 추가
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">점검 체크리스트 (23개 항목)</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {totalAnswered}/{totalItems} 완료
                </span>
                <button
                  type="button"
                  onClick={setAllYes}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  전체 Yes
                </button>
                <button
                  type="button"
                  onClick={() => setChecklistOpen(!checklistOpen)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <span>{checklistOpen ? '접기' : '펼치기'}</span>
                  {checklistOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
            
            {checklistOpen && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">설치 항목 (12개)</h3>
                  <div className="space-y-3">
                    {checklistItems.filter(item => item.category === '설치').map(item => (
                      <div key={item.id} className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.label}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'yes')}
                              className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${checklistAnswers[item.id]?.answer === 'yes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              <Check size={12} />
                              <span>예</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'no')}
                              className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${checklistAnswers[item.id]?.answer === 'no' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              <X size={12} />
                              <span>아니오</span>
                            </button>
                          </div>
                        </div>
                        {checklistAnswers[item.id]?.answer === 'no' && (
                          <input
                            type="text"
                            placeholder="사유를 입력하세요"
                            value={checklistAnswers[item.id]?.reason || ''}
                            onChange={(e) => updateChecklistAnswer(item.id, 'no', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm mt-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">점검 항목 (11개)</h3>
                  <div className="space-y-3">
                    {checklistItems.filter(item => item.category === 'Check').map(item => (
                      <div key={item.id} className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.label}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'yes')}
                              className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${checklistAnswers[item.id]?.answer === 'yes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              <Check size={12} />
                              <span>예</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'no')}
                              className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${checklistAnswers[item.id]?.answer === 'no' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              <X size={12} />
                              <span>아니오</span>
                            </button>
                          </div>
                        </div>
                        {checklistAnswers[item.id]?.answer === 'no' && (
                          <input
                            type="text"
                            placeholder="사유를 입력하세요"
                            value={checklistAnswers[item.id]?.reason || ''}
                            onChange={(e) => updateChecklistAnswer(item.id, 'no', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm mt-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">점검 요약</label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="점검 내용을 간단히 요약하세요..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">완전한 점검 시스템</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 23개 세부 점검 항목 (설치 12개 + 점검 11개)</li>
              <li>• 4가지 제품 동적 추가 시스템</li>
              <li>• 상세한 보고서 자동 생성</li>
              <li>• 로컬 저장 및 점검 기록 관리</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '저장 중...' : '점검 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}