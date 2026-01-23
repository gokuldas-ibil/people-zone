import { MSGraphClientV3 } from '@microsoft/sp-http';

export class GraphService {
  private client: MSGraphClientV3;
  private siteId: string;
  private listId: string;

  constructor(client: MSGraphClientV3) {
    this.client = client;
  }

  /**
   * Initialize GraphService dynamically using current site context and list name
   */
  public async init(context: any, listName: string): Promise<void> {
    try {
      const siteAbsoluteUrl = context.pageContext.web.absoluteUrl; // current site URL
      const url = new URL(siteAbsoluteUrl);
      const hostname = url.hostname;
      const serverRelativePath = url.pathname; // e.g., /sites/StaffLink

      // Get site ID dynamically
      const siteResponse = await this.client.api(`/sites/${hostname}:${serverRelativePath}`).get();
      this.siteId = siteResponse.id;

      // Get list ID dynamically
      const listResponse = await this.client.api(`/sites/${this.siteId}/lists/${listName}`).get();
      this.listId = listResponse.id;

      console.log('GraphService initialized', { siteId: this.siteId, listId: this.listId });
    } catch (error) {
      console.error('Error initializing GraphService', error);
      throw error;
    }
  }

  public async getEmployeesList(): Promise<any[]> {
    const res = await this.client.api(`/sites/${this.siteId}/lists/${this.listId}/items?expand=fields`).get();

    return res.value.map((i: any) => ({
      Id: Number(i.id),
      Title: i.fields.Title,
      EmployeeID: i.fields.EmployeeID,
      Email: i.fields.Email,
      User: i.fields.User ? { Title: i.fields.User?.Title, EMail: i.fields.User?.EMail } : undefined,
      Department: i.fields.Department ? { Title: i.fields.Department?.Title } : undefined,
      DepartmentLookupId: i.fields.DepartmentLookupId || i.fields.DepartmentId || i.fields.Department, // <-- add this line
      Role: i.fields.Role,
      Manager: i.fields.Manager ? { Title: i.fields.Manager?.Title, EMail: i.fields.Manager?.EMail } : undefined,
      DateOfJoining: i.fields.DateOfJoining,
      Status: i.fields.Status,
      ProfilePhoto: i.fields.ProfilePhoto,
    }));
  }

  public async getDepartmentsList(): Promise<any[]> {
    const res = await this.client.api(`/sites/${this.siteId}/lists/${this.listId}/items?expand=fields`).get();
    return res.value.map((i: any) => ({
      Id: Number(i.id),
      DepartmentName: i.fields.DepartmentName || i.fields.Title, // fallback to Title if DepartmentName not present
      DepartmentCode: i.fields.DepartmentCode,
      IsActive: i.fields.IsActive,
    }));
  }

  // public async getTotalEmployees(): Promise<number> {
  //   const res = await this.client
  //     .api(`/sites/${this.siteId}/lists/${this.listId}/items`)
  //     .query({ $top: 1, $count: 'true' })
  //     .header('ConsistencyLevel', 'eventual')
  //     .get();
  //   return res['@odata.count'] || 0;
  // }
  // public async getTotalEmployees(): Promise<number> {
  //   const res = await this.client.api(`/sites/${this.siteId}/lists/${this.listId}`).select('Id').get();

  //   return res?.list?.itemCount ?? 0;
  // }

  public async getTotalEmployees(): Promise<number> {
    const res = await this.client.api(`/sites/${this.siteId}/lists/${this.listId}`).select('displayName,list').get();

    return res?.list?.itemCount ?? 0;
  }

  // public async getTotalDepartments(): Promise<number> {
  //   const res = await this.client
  //     .api(`/sites/${this.siteId}/lists/${this.listId}/items`)
  //     .query({ $top: 1, $count: 'true' })
  //     .header('ConsistencyLevel', 'eventual')
  //     .get();
  //   return res['@odata.count'] || 0;
  // }
  public async getTotalDepartments(): Promise<number> {
    const res = await this.client.api(`/sites/${this.siteId}/lists/${this.listId}`).get();

    return res?.list?.itemCount ?? 0;
  }
}
