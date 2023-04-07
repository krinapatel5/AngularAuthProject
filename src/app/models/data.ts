interface SkillData{
  skillName: string;
  skillRating: number;
}
interface EducationData{
  instituteName: string;
  course: string;
  graduationYear: any;
}
interface EmployeesData {
  empName: string;
  designation: string;
  joiningDate: string;
  empEmail: string;
  empPhone: string;
  skillInfo: SkillData[];
  educationInfo: EducationData[];
}
export interface CompanyData {
  cid: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: number;
  createdAt: string;
  employees: EmployeesData[];
}
