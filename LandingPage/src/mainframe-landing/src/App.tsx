import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Workflow, Coins, ChevronRight, Zap, Target, Globe, Server, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import heroImage from './assets/Gemini_Generated_Image_1onn7b1onn7b1onn.jpg';

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let index = 0;
    
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed((prev) => prev + text.charAt(index));
        index++;
        if (index >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function TerminalSimulation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isActive = true;
    
    const runSequence = async () => {
      while (isActive) {
        setStep(0); // Reset
        await new Promise(r => setTimeout(r, 1000));
        if (!isActive) break;
        
        setStep(1); // Request
        await new Promise(r => setTimeout(r, 1500));
        if (!isActive) break;
        
        setStep(2); // 402 Error
        await new Promise(r => setTimeout(r, 1500));
        if (!isActive) break;
        
        setStep(3); // Auto-settlement
        await new Promise(r => setTimeout(r, 2000));
        if (!isActive) break;
        
        setStep(4); // Success
        await new Promise(r => setTimeout(r, 4000)); // Hold on success for a bit
      }
    };
    
    runSequence();
    
    return () => { isActive = false; };
  }, []);

  return (
    <div className="bg-black/90 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)] font-mono text-sm max-w-2xl mx-auto w-full relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      {/* Terminal Header */}
      <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/10 relative z-10">
        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        <span className="ml-4 text-gray-500 text-xs">agent_process.py</span>
      </div>

      {/* Terminal Body */}
      <div className="p-6 space-y-4 relative z-10 min-h-[300px]">
        {/* Step 1: Request */}
        <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-3 text-gray-400">
            <span className="text-blue-400">agent@stellar:~$</span>
            <span>Fetching premium market data...</span>
          </div>
          <div className="text-gray-500 pl-4 mt-1">GET https://api.market.xyz/premium/v1/data</div>
        </div>

        {/* Step 2: 402 Error */}
        <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2 items-center text-red-400 mt-4">
            <Server className="w-4 h-4" />
            <span>HTTP 402 Payment Required</span>
          </div>
          <div className="text-gray-500 pl-6 mt-1 border-l border-red-500/30 ml-2">
            Invoice: l402_req_89f2d...<br/>
            Amount: 0.5 USDC
          </div>
        </div>

        {/* Step 3: Settlement */}
        <div className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2 items-center text-purple-400 mt-4">
            <ArrowRightLeft className="w-4 h-4 animate-pulse" />
            <span>Interceptor: Auto-settling invoice via Stellar...</span>
          </div>
          <div className="text-gray-500 pl-6 mt-1 border-l border-purple-500/30 ml-2">
            Signing transaction...<br/>
            TxHash: <span className="text-blue-300">0x9d4a...f31a</span>
          </div>
        </div>

        {/* Step 4: Success */}
        <div className={`transition-opacity duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2 items-center text-green-400 mt-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Payment Verified. Replaying Request.</span>
          </div>
          <div className="text-gray-300 pl-6 mt-1">
            <span className="text-gray-500">HTTP 200 OK</span><br/>
            {`{ "status": "success", "data": [ ... ] }`}
          </div>
        </div>

      </div>
    </div>
  );
}

function CodeBlock() {
  return (
    <div className="bg-black/90 border border-white/10 rounded-lg p-6 font-mono text-sm sm:text-base text-gray-300 overflow-x-auto shadow-2xl relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></div>
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
      </div>
      <pre className="leading-relaxed"><code>
<span className="text-pink-400">from</span> stellar_m2m <span className="text-pink-400">import</span> <span className="text-yellow-300">AgentWallet</span>, <span className="text-yellow-300">PaywallInterceptor</span>{`\n`}
<span className="text-pink-400">import</span> httpx{`\n`}
{`\n`}
<span className="text-gray-500"># 1. Initialize non-custodial wallet</span>{`\n`}
wallet = <span className="text-yellow-300">AgentWallet</span>.from_secret(<span className="text-green-400">"S..."</span>){`\n`}
{`\n`}
<span className="text-gray-500"># 2. Wrap client with autonomous settlement</span>{`\n`}
client = <span className="text-yellow-300">PaywallInterceptor</span>(httpx.Client(), wallet){`\n`}
{`\n`}
<span className="text-gray-500"># 3. Agent requests data. If 402 Payment Required,</span>{`\n`}
<span className="text-gray-500"># it auto-pays and retries seamlessly.</span>{`\n`}
response = client.get(<span className="text-green-400">"https://api.weather.com/premium"</span>){`\n`}
<span className="text-blue-400">print</span>(response.json())
      </code></pre>
    </div>
  );
}

function Section({ title, children, className = "", id = "" }: { title: string, children: React.ReactNode, className?: string, id?: string }) {
  return (
    <section id={id} className={`py-24 px-5 sm:px-12 md:px-24 border-t border-white/5 ${className}`}>
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-light text-white mb-16 tracking-tight">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const heroText = "Autonomously pay for the premium APIs and data your agents need. No credit cards, no KYC, no friction. Equip your LangChain and CrewAI agents with non-custodial Stellar wallets to settle HTTP 402 micro-transactions instantly.";
  const { displayed, done } = useTypewriter(heroText, 25, 400);



  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const video = videoRef.current;
    if (!video) return;

    if (isMobile) {
      video.play().catch(console.error);
    } else {
      let mouseTargetTime = 0;
      let scrollTargetTime = 0;
      let targetTime = 0;
      let currentTime = 0;
      let animationFrameId: number;
      let isHeroSection = true;

      const handleMouseMove = (e: MouseEvent) => {
        if (!video.duration) return;
        mouseTargetTime = (e.clientX / window.innerWidth) * video.duration;
        mouseTargetTime = Math.max(0, Math.min(mouseTargetTime, video.duration));
      };

      const handleScroll = () => {
        if (!video.duration) return;
        
        const scrollY = window.scrollY;
        // Consider hero section active if scrolled less than 80% of window height
        isHeroSection = scrollY < window.innerHeight * 0.8;
        
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollableHeight <= 0) return;
        
        const scrollPercent = Math.max(0, Math.min(scrollY / totalScrollableHeight, 1));
        
        // Sine wave for scroll (2 full cycles)
        scrollTargetTime = video.duration * (0.5 + 0.5 * Math.sin(scrollPercent * Math.PI * 4 - Math.PI / 2));
      };

      const smoothScrub = () => {
        // Hybrid tracking: use mouse if in hero section, else use scroll
        targetTime = isHeroSection ? mouseTargetTime : scrollTargetTime;
        
        currentTime += (targetTime - currentTime) * 0.15; 
        
        if (Math.abs(currentTime - video.currentTime) > 0.01) {
          video.currentTime = currentTime;
        }
        
        animationFrameId = requestAnimationFrame(smoothScrub);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Init
      handleScroll();
      animationFrameId = requestAnimationFrame(smoothScrub);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-gray-300 font-sans selection:bg-white/20 overflow-x-hidden">
      
      {/* Background Video (Hybrid Tracking) */}
      <video
        ref={videoRef}
        src="./bg-video-smooth.mp4"
        muted playsInline preload="auto" loop
        className="fixed inset-x-0 bottom-0 top-[10vh] md:top-[12vh] z-0 object-cover object-[50%_top] w-full h-full"
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex flex-row gap-3 items-center">
          <Zap className="text-white w-6 h-6" />
          <span className="text-xl font-bold tracking-tight text-white">StellarM2M</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm font-medium">
          <a href="#how-it-works" className="hover:text-white transition-colors">Architecture</a>
          <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
          <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
          <a href="https://github.com/StellarAgentic/StellarM2M.git" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
            GitHub
          </a>
        </div>
      </nav>

      {/* Main Content wrapper */}
      <main className="relative z-10 pt-32">
        
        {/* 1. HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col justify-center px-5 sm:px-12 md:px-24 relative z-10 pt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full mt-[-5vh]">
            
            {/* Left side: Card Image */}
            <div className="w-full lg:w-[45%] lg:-ml-12 lg:-mt-12 flex justify-start">
              <img 
                src={heroImage} 
                alt="Giving AI agents their own bank accounts" 
                className="w-full max-w-[70%] rounded-2xl shadow-2xl shadow-purple-500/20 border border-white/10 hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

            {/* Right side: Text and CTA */}
            <div className="w-full lg:w-[45%] flex flex-col items-start lg:items-end text-left lg:text-right z-20 lg:-mr-12 lg:-mt-12">
              <div className="max-w-sm lg:scale-[0.85] lg:origin-right flex flex-col items-start lg:items-end">
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed font-light min-h-[80px] bg-black/30 lg:bg-transparent p-4 lg:p-0 rounded-xl backdrop-blur-sm lg:backdrop-blur-none">
                  {displayed}
                  <span className={`inline-block w-2 h-4 ml-1 bg-white align-middle ${done ? 'animate-pulse' : ''}`} />
                </p>

                {/* GitHub CTA */}
                <div className={`mt-6 transition-all duration-1000 ${done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} w-full flex justify-start lg:justify-end`}>
                  <a href="https://github.com/stellar-agent-sdk" target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-sm bg-white text-black font-semibold rounded-lg hover:bg-gray-200 hover:scale-105 transition-all flex items-center justify-center gap-2 w-max shadow-lg shadow-white/10">
                    Fund Your Agent <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. THE AHA MOMENT (CODE SNIPPET) */}
        <Section title="Two lines of code. Infinite economic bandwidth." className="bg-gradient-to-b from-transparent to-black/50">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="backdrop-blur-sm p-6 rounded-2xl bg-black/20 border border-white/5">
              <p className="text-xl leading-relaxed text-gray-400 mb-8 font-light">
                StellarM2M drops seamlessly into your existing Python stack. Wrap your standard HTTP client with the <code className="text-white bg-white/10 px-2 py-1 rounded">PaywallInterceptor</code>, and your agent instantly gains the ability to intercept HTTP 402 errors, parse invoices, and auto-settle payments via the Stellar network.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3"><Terminal className="text-blue-400 w-5 h-5" /> Plug & Play with requests/httpx</li>
                <li className="flex items-center gap-3"><Shield className="text-purple-400 w-5 h-5" /> L402 Protocol Compliant</li>
                <li className="flex items-center gap-3"><Coins className="text-green-400 w-5 h-5" /> Sub-cent transaction fees</li>
              </ul>
            </div>
            <CodeBlock />
          </div>
        </Section>

        {/* 3. TARGET AUDIENCE & USE CASES */}
        <Section title="Built for the Agentic Economy" id="use-cases">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 group/cards">
            <div className="p-8 rounded-2xl bg-black/50 backdrop-blur-md border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <Target className="w-8 h-8 text-blue-400 mb-6 relative z-10" />
              <h3 className="text-xl text-white font-medium mb-3 relative z-10">For Developers</h3>
              <p className="text-gray-400 leading-relaxed text-sm relative z-10">Drop-in Python SDKs and middleware that make it trivial to monetize APIs for machine consumption.</p>
            </div>
            <div className="p-8 rounded-2xl bg-black/50 backdrop-blur-md border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
              <Workflow className="w-8 h-8 text-purple-400 mb-6 relative z-10" />
              <h3 className="text-xl text-white font-medium mb-3 relative z-10">For Traders & Users</h3>
              <p className="text-gray-400 leading-relaxed text-sm relative z-10">Agents manage sub-accounts, execute micro-trades, and pay for services autonomously without exposing your main wallet.</p>
            </div>
            <div className="p-8 rounded-2xl bg-black/50 backdrop-blur-md border border-white/5 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
              <Coins className="w-8 h-8 text-green-400 mb-6 relative z-10" />
              <h3 className="text-xl text-white font-medium mb-3 relative z-10">For DeFi Projects</h3>
              <p className="text-gray-400 leading-relaxed text-sm relative z-10">A new paradigm of "Agentic DeFi". LangChain agents interact with Soroban smart contracts for cross-chain arbitrage.</p>
            </div>
            <div className="p-8 rounded-2xl bg-black/50 backdrop-blur-md border border-white/5 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
              <Globe className="w-8 h-8 text-yellow-400 mb-6 relative z-10" />
              <h3 className="text-xl text-white font-medium mb-3 relative z-10">For the Ecosystem</h3>
              <p className="text-gray-400 leading-relaxed text-sm relative z-10">Millions of daily micro-transactions generated by AI, solidifying Stellar as the highest-throughput network for M2M value.</p>
            </div>
          </div>
        </Section>

        {/* 4. ARCHITECTURE / HOW IT WORKS */}
        <Section title="The 402 Architecture" id="how-it-works" className="bg-black/20 backdrop-blur-sm">
          <TerminalSimulation />
        </Section>

        {/* 5. SECURITY & GUARDRAILS */}
        <Section title="Safety First." className="bg-black/20 backdrop-blur-sm mt-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-l border-white/10 pl-6 group hover:border-purple-500 transition-colors duration-300">
              <h4 className="text-lg text-white mb-2 group-hover:text-purple-400 transition-colors">Non-Custodial</h4>
              <p className="text-sm text-gray-400">Keys are kept locally. Agents sign transactions without exposing secrets to third-party services.</p>
            </div>
            <div className="border-l border-white/10 pl-6 group hover:border-purple-500 transition-colors duration-300">
              <h4 className="text-lg text-white mb-2 group-hover:text-purple-400 transition-colors">Hard Spend Limits</h4>
              <p className="text-sm text-gray-400">Configure strict per-transaction and daily velocity limits to prevent rogue agents from draining funds.</p>
            </div>
            <div className="border-l border-white/10 pl-6 group hover:border-purple-500 transition-colors duration-300">
              <h4 className="text-lg text-white mb-2 group-hover:text-purple-400 transition-colors">Invoice Verification</h4>
              <p className="text-sm text-gray-400">Destination addresses and requested amounts are cryptographically verified before settlement.</p>
            </div>
          </div>
        </Section>

        {/* 6. ROADMAP & 7. ECOSYSTEM (Combined in Footer) */}
        <Section title="The Road to Agentic DeFi" id="roadmap" className="bg-gradient-to-t from-black to-transparent pb-32">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-8 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                <div className="text-sm text-blue-400 mb-2 font-medium">Phase 1 (Current)</div>
                <h4 className="text-2xl text-white mb-4">Core SDK & M2M Settlement</h4>
                <p className="text-gray-400">L402 Python SDK, LangChain Integrations, and core HTTP interceptors.</p>
              </div>
              <div className="flex-1 p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div className="text-sm text-purple-400 mb-2 font-medium">Phase 2</div>
                <h4 className="text-2xl text-white mb-4">Soroban Smart Escrow</h4>
                <p className="text-gray-400">Trustless streaming payments and conditional execution via Soroban smart contracts.</p>
              </div>
              <div className="flex-1 p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div className="text-sm text-green-400 mb-2 font-medium">Phase 3</div>
                <h4 className="text-2xl text-white mb-4">Cross-Chain Interop</h4>
                <p className="text-gray-400">Bridging liquidity to allow agents to interact with EVM-based DeFi via Stellar.</p>
              </div>
            </div>
            
            {/* Ecosystem Alignment */}
            <div className="mt-16 pt-16 border-t border-white/10 text-center">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">Aligned with the Best</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-2xl font-bold text-white hover:scale-110 transition-transform">Stellar</span>
                <span className="text-2xl font-bold text-white hover:scale-110 transition-transform">Soroban</span>
                <span className="text-2xl font-bold text-white hover:scale-110 transition-transform">LangChain</span>
                <span className="text-2xl font-bold text-white hover:scale-110 transition-transform">CrewAI</span>
              </div>
            </div>
          </div>
        </Section>

      </main>
    </div>
  );
}

export default App;
