using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.ValueGeneration;

namespace TigerSan.NET8.WebApi.Helpers
{
    public class SnowflakeIdGenerator : ValueGenerator<long>
    {
        private readonly long _workerId;
        private readonly long _sequence = 0;
        private const long Epoch = 637845120000000000; // 2023-01-01 00:00:00 UTC的Ticks

        public SnowflakeIdGenerator(long workerId) => _workerId = workerId;

        public override long Next(EntityEntry entry)
            => GenerateId(DateTime.UtcNow, _workerId, _sequence);

        private static long GenerateId(DateTime timestamp, long workerId, long sequence)
        {
            var timestampTicks = (timestamp.Ticks - Epoch) / 10000; // 转换为毫秒级精度
            return (timestampTicks << 22) | (workerId << 10) | sequence;
        }

        public override bool GeneratesTemporaryValues => false; // ID为永久值
    }
}
