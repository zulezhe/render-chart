const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartConfigData {
  id: string;
  name: string;
  config: any;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isPublic: boolean;
}

export interface ShareConfig {
  shareId: string;
  shareUrl: string;
  expiresAt?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 保存配置到服务器
  async saveConfig(configData: {
    name: string;
    config: any;
    isPublic?: boolean;
  }): Promise<ApiResponse<ChartConfigData>> {
    return this.request<ChartConfigData>('/charts', {
      method: 'POST',
      body: JSON.stringify(configData),
    });
  }

  // 获取用户的所有配置
  async getMyConfigs(): Promise<ApiResponse<ChartConfigData[]>> {
    return this.request<ChartConfigData[]>('/charts/my');
  }

  // 获取公开的配置列表
  async getPublicConfigs(): Promise<ApiResponse<ChartConfigData[]>> {
    return this.request<ChartConfigData[]>('/charts/public');
  }

  // 根据ID获取配置
  async getConfig(id: string): Promise<ApiResponse<ChartConfigData>> {
    return this.request<ChartConfigData>(`/charts/${id}`);
  }

  // 更新配置
  async updateConfig(
    id: string,
    updateData: {
      name?: string;
      config?: any;
      isPublic?: boolean;
    }
  ): Promise<ApiResponse<ChartConfigData>> {
    return this.request<ChartConfigData>(`/charts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // 删除配置
  async deleteConfig(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/charts/${id}`, {
      method: 'DELETE',
    });
  }

  // 创建分享链接
  async createShareLink(
    configId: string,
    options: {
      expiresIn?: number; // 过期时间（秒）
      allowEdit?: boolean;
    } = {}
  ): Promise<ApiResponse<ShareConfig>> {
    return this.request<ShareConfig>(`/charts/${configId}/share`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  // 获取分享的配置
  async getSharedConfig(shareId: string): Promise<ApiResponse<ChartConfigData>> {
    return this.request<ChartConfigData>(`/shared/${shareId}`);
  }

  // 上传数据文件
  async uploadDataFile(file: File): Promise<ApiResponse<{
    filename: string;
    url: string;
    size: number;
  }>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      headers: {}, // 让浏览器自动设置 Content-Type
      body: formData,
    });
  }

  // 导出图表为图片
  async exportChartAsImage(
    configId: string,
    format: 'png' | 'jpeg' = 'png',
    options: {
      width?: number;
      height?: number;
      quality?: number;
    } = {}
  ): Promise<ApiResponse<{ url: string }>> {
    const params = new URLSearchParams();
    params.append('format', format);
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());

    return this.request<{ url: string }>(`/charts/${configId}/export?${params}`, {
      method: 'POST',
    });
  }

  // 验证配置
  async validateConfig(config: any): Promise<ApiResponse<{
    isValid: boolean;
    errors?: string[];
  }>> {
    return this.request('/charts/validate', {
      method: 'POST',
      body: JSON.stringify({ config }),
    });
  }

  // 获取配置模板
  async getConfigTemplates(): Promise<ApiResponse<ChartConfigData[]>> {
    return this.request<ChartConfigData[]>('/charts/templates');
  }

  // 复制配置
  async duplicateConfig(id: string, newName?: string): Promise<ApiResponse<ChartConfigData>> {
    return this.request<ChartConfigData>(`/charts/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ name: newName }),
    });
  }

  // 服务端渲染图表为PNG
  async renderChartAsPng(
    config: any,
    width: number = 800,
    height: number = 600
  ): Promise<ApiResponse<Blob>> {
    const renderUrl = 'http://localhost:4000/api/render';

    try {
      const response = await fetch(renderUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          width,
          height
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP error! status: ${response.status}`,
        };
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob,
      };
    } catch (error) {
      console.error('Server rendering failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const apiService = new ApiService();