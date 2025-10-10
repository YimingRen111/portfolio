export default function Footer() {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Yiming Ren. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://github.com/YimingRen111" className="hover:underline" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.seek.com.au/profile/yiming-ren-8s7HcY090f" className="hover:underline" target="_blank" rel="noreferrer">Seek</a>
          <a href="https://www.linkedin.com/in/yiming-ren-615742389/" className="hover:underline" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="/resume.pdf" className="hover:underline" target="_blank" rel="noreferrer">Resume</a>
        </div>
      </div>
    </footer>
  );
}
