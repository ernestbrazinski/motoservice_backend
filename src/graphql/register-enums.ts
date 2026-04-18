import { registerEnumType } from '@nestjs/graphql';
import { MileageUnit } from '../motorcycle-listings/mileage-unit.enum';
import { UserRole } from '../users/user-role.enum';

registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(MileageUnit, { name: 'MileageUnit' });
