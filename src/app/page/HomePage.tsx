export default function HomePage() {
  const techStack = [
    { name: "JavaScript", icon: "JS", color: "bg-gradient-to-br from-yellow-400 to-orange-500", shadow: "shadow-yellow-500/30" },
    { name: "TypeScript", icon: "TS", color: "bg-gradient-to-br from-blue-500 to-indigo-600", shadow: "shadow-blue-500/30" },
    { name: "React", icon: "R", color: "bg-gradient-to-br from-cyan-400 to-blue-500", shadow: "shadow-cyan-500/30" },
    { name: "Vue.js", icon: "V", color: "bg-gradient-to-br from-emerald-400 to-green-600", shadow: "shadow-emerald-500/30" },
    { name: "Node.js", icon: "N", color: "bg-gradient-to-br from-green-500 to-emerald-700", shadow: "shadow-green-500/30" },
    { name: "Git", icon: "G", color: "bg-gradient-to-br from-orange-500 to-red-600", shadow: "shadow-orange-500/30" },
  ]

  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.854 6.854a9.937 9.937 0 0 1 2.122 3.087l-1.637.469a8.04 8.04 0 0 0-1.565-2.522l1.08-1.034zm-5.746 1.053l1.06 1.016a8.022 8.022 0 0 0-2.168.621V6.8c.368.03.732.078 1.092.143zM6.854 6.854l1.08 1.034a8.04 8.04 0 0 0-1.565 2.522L4.732 9.94a9.937 9.937 0 0 1 2.122-3.087zM4.732 14.06l1.637-.469a8.04 8.04 0 0 0 1.565 2.522l-1.08 1.034a9.937 9.937 0 0 1-2.122-3.087zm7.232 1.087a8.022 8.022 0 0 0 2.168-.621v1.644a8.735 8.735 0 0 1-1.092-.143l-1.06-1.016.984.136zm5.186 1.034l-1.08-1.034a8.04 8.04 0 0 0 1.565-2.522l1.637.469a9.937 9.937 0 0 1-2.122 3.087zM12 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
        </svg>
      ),
      title: "Lodash",
      desc: "现代 JavaScript 实用工具库",
      url: "https://lodash.com/",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.062 18.75c-3.72 0-6.75-3.017-6.75-6.75 0-3.715 3.03-6.75 6.75-6.75 3.72 0 6.75 3.017 6.75 6.75 0 3.715-3.03 6.75-6.75 6.75zm-.037-12.187c-3.005 0-5.438 2.433-5.438 5.437 0 3.005 2.433 5.438 5.438 5.438 3.004 0 5.437-2.433 5.437-5.438 0-3.004-2.433-5.437-5.437-5.437zm-.576 7.355v-1.94H8.09v-1.846h3.235v-1.94h1.35v5.726h-1.35z"/>
        </svg>
      ),
      title: "Axios",
      desc: "基于 Promise 的 HTTP 客户端",
      url: "https://axios-http.com/",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-14a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
        </svg>
      ),
      title: "Day.js",
      desc: "轻量级日期时间处理库",
      url: "https://day.js.org/",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.5 16.5l-3-3 1.5-1.5 1.5 1.5 3.5-3.5 1.5 1.5-5 5zm12.5-2h-7v-2h7v2zm0-4h-7v-2h7v2zm0-4h-7v-2h7v2z"/>
        </svg>
      ),
      title: "Zod",
      desc: "TypeScript 优先的验证库",
      url: "https://zod.dev/",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      ),
      title: "ECharts",
      desc: "强大的数据可视化图表库",
      url: "https://echarts.apache.org/",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2-9h-2V7h2v4zm0 2h-2v2h2v-2zm-4-2h-2V7h2v4zm0 2h-2v2h2v-2z"/>
        </svg>
      ),
      title: "Vant",
      desc: "Vue 移动端组件库",
      url: "https://vant-ui.github.io/",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2-9h-2V7h2v4zm0 2h-2v2h2v-2zm-4-2h-2V7h2v4zm0 2h-2v2h2v-2zm4 3h-2v2h2v-2zm-4 0h-2v2h2v-2z"/>
        </svg>
      ),
      title: "Element UI",
      desc: "Vue UI 组件库",
      url: "https://element-plus.org/",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-10h-2v2h2v-2zm0 4h-2v2h2v-2zm0-8h-2v2h2V6z"/>
        </svg>
      ),
      title: "Ant Design",
      desc: "企业级 React 组件库",
      url: "https://ant.design/",
      gradient: "from-red-500 to-pink-600",
    },
  ]

  return (
    <div className="flex flex-col items-center py-16 px-6">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-5 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-full text-sm font-medium border border-indigo-100">
            Welcome to My Blog
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            阿真个人技术博客
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            专注于前端技术分享，探索前沿开发技术
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            记录学习历程，分享技术心得，与开发者共同成长
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-10">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            <h2 className="text-2xl font-bold text-gray-800 mx-6">核心技术栈</h2>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href="#"
                className="group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 block overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className={`w-14 h-14 mx-auto mb-3 ${tech.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg ${tech.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    {tech.icon}
                  </div>
                  <p className="text-center text-sm font-medium text-gray-700 group-hover:text-white transition-colors">{tech.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-10">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            <h2 className="text-2xl font-bold text-gray-800 mx-6">常用第三方库</h2>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <a
                key={index}
                href={feature.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 block overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-white/80 transition-colors">{feature.desc}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <div className="inline-block px-8 py-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-gray-600 text-sm font-medium">Built with Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4</p>
            <p className="text-gray-400 text-xs mt-2">© 2024 阿真个人技术博客. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
