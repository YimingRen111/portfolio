export default function Footer() {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Yiming Ren. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://github.com/YimingRen111" className="hover:underline" target="_blank">GitHub</a>
          <a href="/resume.pdf" className="hover:underline" target="_blank">Resume</a>
        </div>
      </div>
    </footer>
  );
}
