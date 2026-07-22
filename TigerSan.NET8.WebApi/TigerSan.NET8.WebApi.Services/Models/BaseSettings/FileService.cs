
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class FileService : IFileService
    {
        #region 【Functions】
        #region [private]
        #region 校验路径是否合法
        /// <summary>校验路径是否合法</summary>
        private bool IsValidPath(string? subPath)
        {
            return string.IsNullOrEmpty(subPath) || !subPath.Contains("..");
        }
        #endregion

        #region 获取“文件类型”
        public static string GetFileType(string fileName)
        {
            var provider = new FileExtensionContentTypeProvider();

            if (!provider.TryGetContentType(fileName, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }
        #endregion
        #endregion [private]

        #region [查]
        #region 获取“文件信息”集合
        public async Task<MyActionResult<MyFileInfo[]>> GetFileList(
            string? subPath = null,
            string searchPattern = "*",
            bool isTopOnly = true)
        {
            try
            {
                if (!Directory.Exists(GlobalSettings.DirFiles))
                {
                    Directory.CreateDirectory(GlobalSettings.DirFiles);
                }

                if (!IsValidPath(subPath)) return MyResults<MyFileInfo[]>.InvalidPath(subPath);

                var path = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                if (!Directory.Exists(path)) return MyResults<MyFileInfo[]>.PathDoesNotExist(path);

                var absoluteFiles = Directory.GetFiles(path, searchPattern, isTopOnly ? SearchOption.TopDirectoryOnly : SearchOption.AllDirectories);

                var fileInfos = absoluteFiles.Select(filePath =>
                {
                    var fileInfo = new FileInfo(filePath);
                    return new MyFileInfo
                    {
                        IsDir = false,
                        Name = Path.GetRelativePath(path, fileInfo.FullName),
                        CreateTime = fileInfo.CreationTime,
                        EditTime = fileInfo.LastWriteTime,
                        Bytes = fileInfo.Length
                    };
                }).ToArray();

                return MyResults<MyFileInfo[]>.Success(null, fileInfos);
            }
            catch (Exception e)
            {
                return MyResults<MyFileInfo[]>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“文件夹信息”集合
        public async Task<MyActionResult<MyFileInfo[]>> GetDirList(
            string? subPath = null,
            string searchPattern = "*",
            bool isTopOnly = true)
        {
            try
            {
                if (!Directory.Exists(GlobalSettings.DirFiles))
                {
                    Directory.CreateDirectory(GlobalSettings.DirFiles);
                }

                if (!IsValidPath(subPath)) return MyResults<MyFileInfo[]>.InvalidPath(subPath);

                var path = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                if (!Directory.Exists(path)) return MyResults<MyFileInfo[]>.PathDoesNotExist(path);

                var absoluteDirs = Directory.GetDirectories(path, searchPattern, isTopOnly ? SearchOption.TopDirectoryOnly : SearchOption.AllDirectories);

                var dirInfos = absoluteDirs.Select(dirPath =>
                {
                    var dirInfo = new DirectoryInfo(dirPath);
                    return new MyFileInfo
                    {
                        IsDir = true,
                        Name = Path.GetRelativePath(path, dirInfo.FullName),
                        CreateTime = dirInfo.CreationTime
                    };
                }).ToArray();

                return MyResults<MyFileInfo[]>.Success(null, dirInfos);
            }
            catch (Exception e)
            {
                return MyResults<MyFileInfo[]>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“路径信息”集合
        public async Task<MyActionResult<MyFileInfo[]>> GetPathList(
            string? subPath = null,
            string searchPattern = "*",
            bool isTopOnly = true)
        {
            try
            {
                if (!Directory.Exists(GlobalSettings.DirFiles))
                {
                    Directory.CreateDirectory(GlobalSettings.DirFiles);
                }

                if (!IsValidPath(subPath)) return MyResults<MyFileInfo[]>.InvalidPath(subPath);

                var path = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                if (!Directory.Exists(path)) return MyResults<MyFileInfo[]>.PathDoesNotExist(path);

                var absoluteDirs = Directory.GetDirectories(path, searchPattern, isTopOnly ? SearchOption.TopDirectoryOnly : SearchOption.AllDirectories);

                var dirInfos = absoluteDirs.Select(dirPath =>
                {
                    var dirInfo = new DirectoryInfo(dirPath);
                    return new MyFileInfo
                    {
                        IsDir = true,
                        Name = Path.GetRelativePath(path, dirInfo.FullName),
                        CreateTime = dirInfo.CreationTime
                    };
                }).ToArray();

                var absoluteFiles = Directory.GetFiles(path, searchPattern, isTopOnly ? SearchOption.TopDirectoryOnly : SearchOption.AllDirectories);

                var fileInfos = absoluteFiles.Select(filePath =>
                {
                    var fileInfo = new FileInfo(filePath);
                    return new MyFileInfo
                    {
                        IsDir = false,
                        Name = Path.GetRelativePath(path, fileInfo.FullName),
                        CreateTime = fileInfo.CreationTime,
                        EditTime = fileInfo.LastWriteTime,
                        Bytes = fileInfo.Length
                    };
                }).ToArray();

                return MyResults<MyFileInfo[]>.Success(null, dirInfos.Concat(fileInfos).ToArray());
            }
            catch (Exception e)
            {
                return MyResults<MyFileInfo[]>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“文件下载信息”
        public async Task<MyActionResult<FileDownloadInfo>> GetFileDownloadInfo(string name, string? subPath = null)
        {
            try
            {
                if (!IsValidPath(subPath)) return MyResults<FileDownloadInfo>.InvalidPath(subPath);
                if (string.IsNullOrWhiteSpace(name)) return MyResults<FileDownloadInfo>.NameCannotBeEmpty;

                var targetDir = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                var filePath = Path.Combine(targetDir, name);

                if (!File.Exists(filePath)) return MyResults<FileDownloadInfo>.PathDoesNotExist(filePath);

                var contentType = GetFileType(name);

                return MyResults<FileDownloadInfo>.Success(null, new FileDownloadInfo
                {
                    FilePath = filePath,
                    FileName = name,
                    ContentType = contentType
                });
            }
            catch (Exception e)
            {
                return MyResults<FileDownloadInfo>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 创建“文件夹”
        public async Task<MyActionResult<object>> CreatDir(string name, string? subPath = null)
        {
            try
            {
                if (!Directory.Exists(GlobalSettings.DirFiles))
                {
                    Directory.CreateDirectory(GlobalSettings.DirFiles);
                }

                if (!IsValidPath(subPath)) return MyResults<object>.InvalidPath(subPath);

                var targetDir = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                if (!Directory.Exists(targetDir)) return MyResults<object>.PathDoesNotExist(subPath);
                var dirPath = Path.Combine(targetDir, name);
                if (Directory.Exists(dirPath)) return MyResults<object>.DirAlreadyExists;

                Directory.CreateDirectory(dirPath);

                return MyResults<object>.Success();
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 上传“文件”
        public async Task<MyActionResult<object>> UploadFile(
            IFormFile file,
            string? subPath = null,
            bool isOverwrite = false,
            long? maxSize = null,
            CancellationToken cancellationToken = default)
        {
            var filePath = string.Empty;
            try
            {
                cancellationToken.ThrowIfCancellationRequested();

                if (!Directory.Exists(GlobalSettings.DirFiles))
                {
                    Directory.CreateDirectory(GlobalSettings.DirFiles);
                }

                if (!IsValidPath(subPath)) return MyResults<object>.InvalidPath(subPath);
                if (file == null || file.Length == 0) return MyResults<object>.FileIsNullOrEmpty;

                if (maxSize == null) maxSize = GlobalSettings.MaxFileSize;
                // 1. 验证文件大小
                if (file.Length > maxSize * 1024 * 1024) return MyResults<object>.FileSizeExceedsLimit(maxSize.Value);

                // 2. 验证文件扩展名
                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(ext)) return MyResults<object>.UnsupportedFileType;

                // 3. 目标路径
                var targetDir = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                if (!Directory.Exists(targetDir)) return MyResults<object>.PathDoesNotExist(subPath);

                // 5. 保存文件
                filePath = Path.Combine(targetDir, file.FileName);
                if (File.Exists(filePath))
                {
                    if (isOverwrite)
                    {
                        File.Delete(filePath);
                    }
                    else
                    {
                        return MyResults<object>.FileAlreadyExists;
                    }
                }

                using (var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None, 81920, true))
                {
                    await file.CopyToAsync(stream, cancellationToken);
                    await stream.FlushAsync(cancellationToken);
                }

                return MyResults<object>.Success();
            }
            catch (OperationCanceledException)
            {
                if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                return MyResults<object>.Warning("Upload cancelled by user.");
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 重命名
        public async Task<MyActionResult<object>> Rename(string oldName, string newName, string? subPath = null)
        {
            try
            {
                if (!IsValidPath(subPath)) return MyResults<object>.InvalidPath(subPath);
                if (string.IsNullOrWhiteSpace(oldName)) return MyResults<object>.NameCannotBeEmpty;
                if (string.IsNullOrWhiteSpace(newName)) return MyResults<object>.NameCannotBeEmpty;

                var targetDir = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                var oldPath = Path.Combine(targetDir, oldName);
                var newPath = Path.Combine(targetDir, newName);

                if (File.Exists(oldPath))
                {
                    if (File.Exists(newPath)) return MyResults<object>.NameRepeated;
                    File.Move(oldPath, newPath);
                }
                else if (Directory.Exists(oldPath))
                {
                    if (Directory.Exists(newPath)) return MyResults<object>.NameRepeated;
                    Directory.Move(oldPath, newPath);
                }
                else
                {
                    return MyResults<object>.PathDoesNotExist(oldPath);
                }

                return MyResults<object>.Success(null, true);
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [改]

        #region [删]
        public async Task<MyActionResult<object>> Delete(List<string> names, string? subPath = null, bool recursive = false)
        {
            try
            {
                foreach (var name in names)
                {
                    if (!IsValidPath(subPath)) return MyResults<object>.InvalidPath(subPath);
                    if (string.IsNullOrWhiteSpace(name)) return MyResults<object>.NameCannotBeEmpty;

                    var targetDir = string.IsNullOrEmpty(subPath) ? GlobalSettings.DirFiles : Path.Combine(GlobalSettings.DirFiles, subPath);
                    var path = Path.Combine(targetDir, name);

                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                    else if (Directory.Exists(path))
                    {
                        if (!recursive && Directory.GetFiles(path).Length > 0) return MyResults<object>.DirIsNotEmpty(name);
                        Directory.Delete(path, recursive);
                    }
                    else
                    {
                        return MyResults<object>.PathDoesNotExist(path);
                    }
                }
                return MyResults<object>.Success(null, true);
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion [删]
        #endregion 【Functions】
    }
}
