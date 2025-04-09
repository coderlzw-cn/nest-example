import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('storage')
  @HealthCheck()
  storageCheck() {
    return this.health.check([() => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 })]);
  }

  @Get('memory')
  @HealthCheck()
  memoryCheck() {
    return this.health.check([() => this.memory.checkHeap('memory', 150 * 1024 * 1024)]);
  }
}
