export function mapProjectsData(apiProjects: any[]): any[] {    
  return apiProjects.map((item, idx) => ({
    key: item.id || idx,
    name: item.name || '',
    status: item.status || '',
    dueDate: item.end_date || '',
    team: item.total_members || '',
    tasks: item.total_tasks || '',
    progress: item.progress_percent || '',
  }));
}
