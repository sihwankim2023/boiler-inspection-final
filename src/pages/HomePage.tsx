import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, AlertTriangle, XCircle, Calendar, User, MapPin, BarChart3, Play, Settings } from 'lucide-react'

interface Inspection {
  id: string
  inspection_date: string
  inspector: string
  site_name: string
  address: string
  result: string
  summary: string
  products?: Array<{name: string, count: number}>
  checklist_answers?: Record<string, {answer: string, reason: string}>
  photo_count?: number
  created_at: string
}

export default function HomePage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    normal: 0,
    caution: 0,
    defective: 0
  })

  useEffect(() => {
    const loadInspections = () => {
      try {
        const data = localStorage.getItem('inspections')
        const parsedData = data ? JSON.parse(data) : []
        setInspections(parsedData)
        
        const now = new Date()
        const thisMonth = parsedData.filter((inspection: Inspection) => {
          const inspectionDate = new Date(inspection.inspection_date)
          return inspectionDate.getMonth() === now.getMonth() && 
                 inspectionDate.getFullYear() === now.getFullYear()
        }).length
        
        const normal = parsedData.filter((i: Inspection) => i.result === '정상').length
        const caution = parsedData.filter((i: Inspection) => i.result === '주의').length
        const defective = parsedData.filter((i: Inspection) => i.result === '불량').length
        
        setStats({
          total: parsedData.length,
          thisMonth,
          normal,
          caution,
          defective
        })
      } catch (error) {
        console.error('데이터 로드 실패:', error)
        setInspections([])
      } finally {
        setLoading(false)
      }
    }

    loadInspections()
  }, [])

  const recentInspections = inspections.slice(0, 8)

  const getResultIcon = (result: string) => {
    switch (result) {
      case '정상':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case '주의':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case '불량':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getResultBadge = (result: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"
    switch (result) {
      case '정상':
        return `${baseClasses} bg-green-100 text-green-800`
      case '주의':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case '불량':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            보일러 점검 관리 시스템
          </h1>
          <p className="text-gray-600">
            캐스케이드 시스템 정기점검용 모바일 앱
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">총 점검 수</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">정상</p>
              <p className="text-2xl font-bold">{stats.normal}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">주의</p>
              <p className="text-2xl font-bold">{stats.caution}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">불량</p>
              <p className="text-2xl font-bold">{stats.defective}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>
        
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">이번 달</p>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">새 점검 시작</h2>
          <p className="mb-4 opacity-90">
            23개 체크리스트와 완전한 기능을 포함한 점검을 시작하세요
          </p>
          <ul className="text-sm opacity-90 mb-4 space-y-1">
            <li>• 23개 세부 점검 항목</li>
            <li>• 4가지 제품 동적 추가</li>
            <li>• 사진 첨부 (최대 5장)</li>
            <li>• 상세 보고서 생성</li>
          </ul>
          <Link 
            to="/inspection" 
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            <Play className="w-5 h-5" />
            <span>점검 시작하기</span>
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">시스템 현황</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="opacity-90">배포 상태</span>
              <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                성공
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-90">데이터 저장</span>
              <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                로컬
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-90">기능 상태</span>
              <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                완전
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">최근 점검 기록</h2>
          <span className="text-sm text-gray-500">
            {recentInspections.length > 0 ? `최근 ${recentInspections.length}개` : '기록 없음'}
          </span>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">점검 기록을 불러오는 중...</p>
          </div>
        ) : recentInspections.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">아직 점검 기록이 없습니다</p>
            <p className="text-sm text-gray-500 mb-4">
              첫 점검을 시작하여 완전한 보고서를 생성해보세요
            </p>
            <Link 
              to="/inspection" 
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>첫 점검 시작하기</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentInspections.map((inspection) => (
              <div key={inspection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getResultIcon(inspection.result)}
                    <h3 className="font-semibold text-lg">{inspection.site_name}</h3>
                  </div>
                  <span className={getResultBadge(inspection.result)}>
                    {inspection.result}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{inspection.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>점검자: {inspection.inspector}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>점검일: {new Date(inspection.inspection_date).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                
                {inspection.products && inspection.products.length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">설치 제품:</span>
                      <span className="ml-2">
                        {inspection.products.map((p: any) => `${p.name} ${p.count}대`).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
                
                {inspection.summary && (
                  <div className="mt-3 p-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">요약:</span> {inspection.summary}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}