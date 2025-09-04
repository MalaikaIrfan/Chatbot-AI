import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject, 
  type ChatMessage, 
  type InsertChatMessage,
  type Analytics,
  type InsertAnalytics
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Chat operations
  getChatMessages(): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearChatHistory(): Promise<void>;
  
  // Analytics operations
  getAnalytics(): Promise<Analytics[]>;
  addAnalyticsEntry(entry: InsertAnalytics): Promise<Analytics>;
  getAnalyticsSummary(): Promise<{
    totalRequests: number;
    imagesAnalyzed: number;
    contentGenerated: number;
    activeProjects: number;
    featureBreakdown: { feature: string; count: number; percentage: number }[];
    avgResponseTime: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private chatMessages: ChatMessage[];
  private analytics: Analytics[];

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.chatMessages = [];
    this.analytics = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
      metadata: insertProject.metadata || null,
      content: insertProject.content || null,
      description: insertProject.description || null,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return [...this.chatMessages];
  }

  async addChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.push(message);
    return message;
  }

  async clearChatHistory(): Promise<void> {
    this.chatMessages = [];
  }

  async getAnalytics(): Promise<Analytics[]> {
    return [...this.analytics];
  }

  async addAnalyticsEntry(insertEntry: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const entry: Analytics = {
      ...insertEntry,
      id,
      date: new Date(),
      requestCount: insertEntry.requestCount || 0,
      responseTime: insertEntry.responseTime || 0,
    };
    this.analytics.push(entry);
    return entry;
  }

  async getAnalyticsSummary(): Promise<{
    totalRequests: number;
    imagesAnalyzed: number;
    contentGenerated: number;
    activeProjects: number;
    featureBreakdown: { feature: string; count: number; percentage: number }[];
    avgResponseTime: number;
  }> {
    const totalRequests = this.analytics.reduce((sum, entry) => sum + (entry.requestCount || 0), 0);
    const imagesAnalyzed = this.analytics
      .filter(entry => entry.feature === 'vision')
      .reduce((sum, entry) => sum + (entry.requestCount || 0), 0);
    const contentGenerated = this.analytics
      .filter(entry => entry.feature === 'content')
      .reduce((sum, entry) => sum + (entry.requestCount || 0), 0);
    const activeProjects = this.projects.size;

    // Calculate feature breakdown
    const featureCount: Record<string, number> = {};
    this.analytics.forEach(entry => {
      featureCount[entry.feature] = (featureCount[entry.feature] || 0) + (entry.requestCount || 0);
    });

    const featureBreakdown = Object.entries(featureCount).map(([feature, count]) => ({
      feature,
      count,
      percentage: totalRequests > 0 ? (count / totalRequests) * 100 : 0,
    }));

    const avgResponseTime = this.analytics.length > 0
      ? this.analytics.reduce((sum, entry) => sum + (entry.responseTime || 0), 0) / this.analytics.length
      : 0;

    return {
      totalRequests,
      imagesAnalyzed,
      contentGenerated,
      activeProjects,
      featureBreakdown,
      avgResponseTime,
    };
  }
}

export const storage = new MemStorage();
