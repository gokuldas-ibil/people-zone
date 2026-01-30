import { GraphService } from '../webparts/peopleZone/services/GraphService';

// Sample real names
const names = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Lee',
  'Diana Patel',
  'Ethan Brown',
  'Fiona Clark',
  'George Miller',
  'Hannah Wilson',
  'Ian Davis',
  'Julia Moore',
  'Kevin Taylor',
  'Laura Anderson',
  'Michael Thomas',
  'Nina Jackson',
  'Oscar White',
  'Paula Harris',
  'Quentin Martin',
  'Rachel Thompson',
  'Sam Lewis',
  'Tina Walker',
  'Uma Young',
  'Victor King',
  'Wendy Scott',
  'Xander Green',
  'Yara Adams',
  'Zane Baker',
  'Amber Carter',
  'Blake Evans',
  'Cathy Foster',
  'Derek Graham',
  'Ella Hill',
  'Frankie James',
  'Grace Kelly',
  'Henry Lane',
  'Isla Morgan',
  'Jackie Nelson',
  'Kurt Owens',
  'Lily Perez',
  'Mason Reed',
  'Nora Stewart',
  'Owen Turner',
  'Penny Underwood',
  'Quinn Vaughn',
  'Rita Webb',
  'Sean Xu',
  'Tara York',
  'Ulysses Zimmerman',
  'Vera Brooks',
  'Will Chandler',
  'Zoe Daniels',
];

// 1. Generate 50 unique employee objects
const employees = Array.from({ length: 50 }).map((_, i) => {
  const idx = i + 1;
  const name = names[i % names.length];
  return {
    Title: name,
    EmployeeID: `EMP${1000 + idx}`,
    Email: `${name.toLowerCase().replace(/ /g, '')}${idx}enttune@yopmail.com`,
    DepartmentLookupId: ((idx - 1) % 5) + 1, // 1-5 cycling
    Role: ['Employee', 'Manager', 'Admin'][idx % 3],
    DateOfJoining: `2022-01-${((idx % 28) + 1).toString().padStart(2, '0')}`,
    Status: idx % 2 === 0 ? 'Active' : 'Inactive',
    ProfilePhoto: '', // leave empty or set a placeholder URL
  };
});

// 2. Function to add all employees one by one
export async function bulkAddEmployees(context: any) {
  const client = await context.msGraphClientFactory.getClient('3');
  const service = new GraphService(client);
  await service.init(context, 'Employees');

  for (const emp of employees) {
    try {
      await service.addEmployee(emp);
      // eslint-disable-next-line no-console
      console.log(`Added: ${emp.Title}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to add ${emp.Title}:`, err);
    }
  }
}

// Usage (in your webpart/component):
// import { bulkAddEmployees } from '../../scripts/bulkAddEmployees';
// await bulkAddEmployees(this.props.context);
