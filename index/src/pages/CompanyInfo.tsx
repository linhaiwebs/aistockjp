import { ArrowLeft, Building, MapPin, Calendar, Briefcase, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompanyInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          トップページに戻る
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building className="w-6 h-6 text-blue-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">会社概要</h1>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">株式会社アドバンティ</h2>
                <p className="text-lg text-gray-700 mb-2">Advanti Co., Ltd.</p>
              </div>
            </section>

            <section className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">所在地</h3>
                      <p className="text-gray-700 leading-relaxed">
                        〒108-0014<br />
                        東京都港区芝5-31-19<br />
                        港ビル8階
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">設立</h3>
                      <p className="text-gray-700 text-lg">2015年9月</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">業種</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      デジタルマーケティング／広告運用／データ分析
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <h3 className="text-xl font-bold text-gray-900">事業内容</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white border-2 border-blue-100 rounded-lg p-5 hover:border-blue-300 transition-colors">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    広告戦略・ブランド戦略コンサルティング
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed ml-10">
                    企業のビジネス目標に合わせた広告戦略とブランディング戦略を立案します
                  </p>
                </div>

                <div className="bg-white border-2 border-blue-100 rounded-lg p-5 hover:border-blue-300 transition-colors">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Google Ads、Facebook、YouTube等のクロスチャネル広告運用・最適化
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed ml-10">
                    複数の広告プラットフォームを統合的に運用し、最大の効果を引き出します
                  </p>
                </div>

                <div className="bg-white border-2 border-blue-100 rounded-lg p-5 hover:border-blue-300 transition-colors">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    広告効果測定、データ分析、報告書作成
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed ml-10">
                    詳細なデータ分析とわかりやすい報告書で広告効果を可視化します
                  </p>
                </div>

                <div className="bg-white border-2 border-blue-100 rounded-lg p-5 hover:border-blue-300 transition-colors">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    データ駆動型広告戦略と効果的な広告投資の支援
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed ml-10">
                    データ分析に基づき、ROIを最大化する広告投資をサポートします
                  </p>
                </div>

                <div className="bg-white border-2 border-blue-100 rounded-lg p-5 hover:border-blue-300 transition-colors">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    広告効果追跡ツール、プラットフォーム提供
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed ml-10">
                    広告効果をリアルタイムで追跡できるツールとプラットフォームを提供します
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">企業理念</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  株式会社アドバンティは、データ駆動型のデジタルマーケティングソリューションを提供することで、
                  企業の広告成果を最大化することを使命としています。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  クロスチャネル広告運用、データ分析、効果測定など、
                  包括的な広告ソリューションを通じて、お客様のビジネス成長を強力にサポートします。
                </p>
              </div>
            </section>

            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mt-8">
              <h3 className="font-bold text-gray-900 mb-3">お問い合わせ</h3>
              <p className="text-sm text-gray-700 mb-4">
                弊社サービスに関するお問い合わせは、お気軽にご連絡ください。
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                お問い合わせフォームへ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
