export function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            WebDev <span className="text-brand-cyan">Solutions</span>
          </h3>
          <p className="text-brand-silver mt-2 text-sm">Engineering Tomorrow's Web, Today.</p>
        </div>
        
        <div className="flex gap-6 text-sm text-brand-silver">
          <a href="#" className="hover:text-white transition-colors">Services</a>
          <a href="#" className="hover:text-white transition-colors">Process</a>
          <a href="#" className="hover:text-white transition-colors">Work</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="text-brand-silver/50 text-sm">
          &copy; {new Date().getFullYear()} WebDev Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
