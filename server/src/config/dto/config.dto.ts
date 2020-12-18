import { ApiProperty } from '@nestjs/swagger';
export class CreateConfigDto {

    // 部门
    @ApiProperty()
    readonly depart: string;
    // 组
    @ApiProperty()
    readonly group: string;

    @ApiProperty()
    readonly env: string;

    // key
    @ApiProperty()
    readonly key: string;

    // 存储值
    @ApiProperty()
    readonly value: string;
}