export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          background-color: #f9f9f9;
          color: #2c3e50;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 2rem;
          padding: 2rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .header {
          border-bottom: 1px solid #eaecef;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }
        .title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #3eaf7c;
        }
        .description {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 2.5rem;
        }
        .api-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .api-card {
          background-color: #f3f5f7;
          border-radius: 6px;
          padding: 1.5rem;
          text-align: left;
          border-left: 5px solid #3eaf7c;
        }
        .api-path {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier,
            monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .api-method {
          display: inline-block;
          background-color: #3eaf7c;
          color: #fff;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-left: 0.5rem;
        }
        .api-description {
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.5rem;
        }
      `}</style>
      <div className="container">
        <div className="header">
          <h1 className="title">SealDice Log Service</h1>
        </div>
        <p className="description">
          用于对接海豹骰子（SealDice）的自维护日志存储后端服务。
        </p>
        <div className="api-grid">
          <div className="api-card">
            <div>
              <span className="api-path">/api/dice/log</span>
              <span className="api-method">PUT</span>
            </div>
            <p className="api-description">上传日志文件。</p>
          </div>
          <div className="api-card">
            <div>
              <span className="api-path">/api/dice/load_data</span>
              <span className="api-method">GET</span>
            </div>
            <p className="api-description">根据 Key 和 Password 读取日志数据。</p>
          </div>
        </div>
      </div>
    </>
  );
}