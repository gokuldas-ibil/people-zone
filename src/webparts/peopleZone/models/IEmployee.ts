export interface EmployeePageProps {
  context: any;
  getInitials: (name: string) => string;
  getProfileImageUrl: (employee: IEmployee) => string | null;
}

export interface IEmployee {
  Id: number;
  Title: string; // Full name
  EmployeeID?: string;
  Email?: string;
  User?: {
    Title: string;
    EMail: string;
  };
  Department?: {
    Title: string;
  };
  Role?: string;
  Manager?: {
    Title: string;
    EMail: string;
  };
  DateOfJoining?: string;
  Status?: string;
  ProfilePhoto?: string;
}

export interface EmployeeForm {
  Title: string; // Full name
  EmployeeID: string;
  Email: string;
  DepartmentLookupId: string;
  Role: string;
  Manager: string;
  DateOfJoining: string;
  Status: string;
  ProfilePhoto: string;
}
