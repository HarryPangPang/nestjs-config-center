import { ApiProperty } from '@nestjs/swagger';
export class QueryConfigDto {

    // 部门+
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
}