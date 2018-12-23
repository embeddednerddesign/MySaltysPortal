import { Service } from './service';
import { StaffSchedule } from './scheduler/event';

export interface Staff {
    staffId: number;
    name: string;
    services: StaffService[];
    staffSchedules: StaffSchedule[];
}

export interface StaffService {
    serviceId: number;
    service: Service;
    staffId: number;
    staff: Staff;
}
