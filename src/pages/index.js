export default function HomePage() {
  return (
    <div>
      <h1>海豹日志后端服务</h1>
      <p>此服务正在运行。</p>
      <p>上传接口: /api/dice/log (PUT)</p>
      <p>读取接口: /api/dice/load_data (GET)</p>
    </div>
  );
}