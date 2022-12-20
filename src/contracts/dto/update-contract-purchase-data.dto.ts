import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractPurchaseDataDto {
    @ApiProperty({ example: 1, description: 'The contract identification' })
    id: number;
    @ApiProperty({ example: 'Quotas', description: 'The payment method' })
    payment: string;
    @ApiProperty({ example: 5, description: 'The amount required' })
    amount: number;
}