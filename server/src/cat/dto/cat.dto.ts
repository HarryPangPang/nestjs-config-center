import { ApiProperty } from '@nestjs/swagger';
export class CreateCatDto {

    @ApiProperty()
    readonly text: string;

    @ApiProperty()
    readonly age: number;
}