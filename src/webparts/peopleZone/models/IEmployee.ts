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
