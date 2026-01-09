const { S3Storage } = require("coze-coding-dev-sdk");
const fs = require("fs");

async function uploadProject() {
  const storage = new S3Storage({
    bucketName: process.env.COZE_BUCKET_NAME,
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    region: "cn-beijing",
  });

  const tarGzPath = "/tmp/my-tech-blog-v2.tar.gz";

  console.log("📦 正在读取文件...");
  const fileBuffer = fs.readFileSync(tarGzPath);

  console.log("📤 正在上传到对象存储...");
  const fileKey = await storage.uploadFile({
    fileContent: fileBuffer,
    fileName: "my-tech-blog-v2.tar.gz",
    contentType: "application/gzip",
  });

  console.log("✅ 上传成功! Key:", fileKey);

  console.log("🔗 正在生成下载链接...");
  const downloadUrl = await storage.generatePresignedUrl({
    key: fileKey,
    expireTime: 86400 * 7, // 7天有效期
  });

  console.log("\n📥 下载链接（7天有效）:");
  console.log(downloadUrl);
  console.log("\n💡 下载后执行以下步骤:");
  console.log("1. 解压: tar -xzf my-tech-blog-v2.tar.gz");
  console.log("2. 进入目录: cd my-tech-blog-clean");
  console.log("3. 初始化 git: git init && git add . && git commit -m 'Initial commit'");
  console.log("4. 关联远程仓库: git remote add origin https://github.com/sfasakjsaa/my-tech-blog.git");
  console.log("5. 推送代码: git push -u origin main");
}

uploadProject().catch(console.error);
