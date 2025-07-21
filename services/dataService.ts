import { Persona, FeedItem } from '../types';

interface ExportData {
  personas: Persona[];
  feedItems: FeedItem[];
  exportDate: string;
  version: string;
}

export const exportData = (personas: Persona[], feedItems: FeedItem[]): void => {
  const exportData: ExportData = {
    personas,
    feedItems,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inspoflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result) as ExportData;
        
        // 验证数据格式
        if (!data.personas || !Array.isArray(data.personas)) {
          throw new Error('无效的数据格式：缺少角色数据');
        }
        
        if (!data.feedItems || !Array.isArray(data.feedItems)) {
          throw new Error('无效的数据格式：缺少内容数据');
        }
        
        // 转换日期字符串为Date对象
        const processedData = {
          ...data,
          feedItems: data.feedItems.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt)
          }))
        };
        
        resolve(processedData);
      } catch (error) {
        reject(new Error(`解析文件失败: ${error instanceof Error ? error.message : '未知错误'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
};