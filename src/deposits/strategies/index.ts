import { createDepositDto } from '../dto/createDeposit.dto';
export interface DepositStrategy {
  execute(dto: createDepositDto): Promise<any>;
}
