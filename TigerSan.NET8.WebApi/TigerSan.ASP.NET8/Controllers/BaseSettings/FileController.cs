using Microsoft.AspNetCore.Mvc;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ApiController]
    [NotIdController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {
        #region 【Fields】
        private readonly IFileService _service;
        #endregion 【Fields】

        #region 【Ctor】
        public FileController(IFileService service)
        {
            _service = service;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpGet]
        [Route("FileList")]
        /// <summary>获取“文件信息”集合</summary>
        public async Task<MyActionResult<MyFileInfo[]>> GetFileList(
            [FromQuery] string? subPath = null,
            [FromQuery] string searchPattern = "*",
            [FromQuery] bool isTopOnly = true)
        {
            return await _service.GetFileList(subPath, searchPattern, isTopOnly);
        }

        [HttpGet]
        [Route("DirList")]
        /// <summary>获取“文件夹信息”集合</summary>
        public async Task<MyActionResult<MyFileInfo[]>> GetDirList(
            [FromQuery] string? subPath = null,
            [FromQuery] string searchPattern = "*",
            [FromQuery] bool isTopOnly = true)
        {
            return await _service.GetDirList(subPath, searchPattern, isTopOnly);
        }

        [HttpGet]
        [Route("PathList")]
        /// <summary>获取“路径信息”集合</summary>
        public async Task<MyActionResult<MyFileInfo[]>> GetPathList(
            [FromQuery] string? subPath = null,
            [FromQuery] string searchPattern = "*",
            [FromQuery] bool isTopOnly = true)
        {
            return await _service.GetPathList(subPath, searchPattern, isTopOnly);
        }

        /// <summary>下载“文件”</summary>
        [HttpGet("DownloadFile")]
        public async Task<IActionResult> DownloadFile(
            [FromQuery] string name,
            [FromQuery] string? subPath = null)
        {
            try
            {
                var res = await _service.GetFileDownloadInfo(name, subPath);
                var fileInfo = res.Data;
                if (fileInfo == null) return BadRequest(LogHelper.Instance.Error(res.Message));

                var stream = new FileStream(fileInfo.FilePath, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true);

                return new FileStreamResult(stream, fileInfo.ContentType)
                {
                    FileDownloadName = fileInfo.FileName
                };
            }
            catch (FileNotFoundException fe)
            {
                return NotFound(LogHelper.Instance.Error(fe.GetMessage()));
            }
            catch (ArgumentException ae)
            {
                return BadRequest(LogHelper.Instance.Error(ae.GetMessage()));
            }
            catch (Exception e)
            {
                return StatusCode(500, LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion [查]

        #region [增]
        /// <summary>创建“文件夹”</summary>
        [HttpPost("Dir")]
        public async Task<MyActionResult<object>> CreatDir(
            [FromQuery] string name,
            [FromQuery] string? subPath = null)
        {
            return await _service.CreatDir(name, subPath);
        }

        /// <summary>上传“文件”</summary>
        [HttpPost("Upload")]
        [RequestSizeLimit(1073741824)]
        public async Task<MyActionResult<object>> UploadFile(
            IFormFile file,
            [FromForm] string? subPath = null,
            [FromForm] bool isOverwrite = false,
            [FromForm] long? maxSize = null,
            CancellationToken cancellationToken = default)
        {
            return await _service.UploadFile(file, subPath, isOverwrite, maxSize, cancellationToken);
        }
        #endregion [增]

        #region [改]
        /// <summary>重命名</summary>
        [HttpPut("Rename")]
        public async Task<MyActionResult<object>> Rename(
            [FromQuery] string oldName, 
            [FromQuery] string newName,
            [FromQuery] string? subPath = null)
        {
            return await _service.Rename(oldName, newName, subPath);
        }
        #endregion [改]

        #region [删]
        /// <summary>删除</summary>
        [HttpPost("Delete")]
        public async Task<MyActionResult<object>> Delete(
            [FromBody] List<string> names,
            [FromQuery] string? subPath = null,
            [FromQuery] bool recursive = false)
        {
            return await _service.Delete(names, subPath, recursive);
        }
        #endregion [删]
        #endregion 【Functions】
    }
}
