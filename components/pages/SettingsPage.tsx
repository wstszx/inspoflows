import React, { useRef, useState, useEffect } from 'react';
import { usePersonas } from '../../contexts/PersonaContext';
import { useFeedContent } from '../../contexts/FeedContentContext';
import { useTheme } from '../../contexts/ThemeContext';
import { exportData, importData } from '../../services/dataService';
import Button from '../ui/Button';
import { DownloadIcon } from '../icons/DownloadIcon';
import { UploadIcon } from '../icons/UploadIcon';
import { MoonIcon } from '../icons/MoonIcon';
import { SunIcon } from '../icons/SunIcon';

const API_KEY_STORAGE_KEY = 'gemini-api-key';
const MODEL_NAME_STORAGE_KEY = 'gemini-model-name';
const DEFAULT_MODEL_NAME = 'gemini-2.5-flash';

const SettingsPage: React.FC = () => {
  const { personas, addPersona, updatePersona } = usePersonas();
  const { allItems, addItem } = useFeedContent();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    const storedModelName = localStorage.getItem(MODEL_NAME_STORAGE_KEY);
    setModelName(storedModelName || DEFAULT_MODEL_NAME);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    localStorage.setItem(MODEL_NAME_STORAGE_KEY, modelName);
    setSaveStatus('设置已保存！');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleExport = () => {
    try {
      exportData(personas, allItems);
      setImportStatus('数据导出成功！');
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      setImportStatus(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);

    try {
      const data = await importData(file);
      
      // 导入角色数据
      data.personas.forEach(persona => {
        // 检查是否已存在相同ID的角色
        const existingPersona = personas.find(p => p.id === persona.id);
        if (existingPersona) {
          updatePersona(persona);
        } else {
          const { id, ...personaData } = persona;
          addPersona(personaData);
        }
      });

      // 导入内容数据
      data.feedItems.forEach(item => {
        // 检查是否已存在相同ID的内容
        const existingItem = allItems.find(i => i.id === item.id);
        if (!existingItem) {
          addItem(item);
        }
      });

      setImportStatus(`导入成功！导入了 ${data.personas.length} 个角色和 ${data.feedItems.length} 条内容`);
    } catch (error) {
      setImportStatus(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsImporting(false);
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-onBackground tracking-tight">设置</h1>
        <p className="mt-4 text-lg text-onBackground/80">
          管理您的数据和应用偏好
        </p>
      </div>

      <div className="space-y-8">
        {/* API 设置 */}
        <div className="bg-surface rounded-xl p-6 border border-outline/20">
          <h2 className="text-2xl font-bold text-onSurface mb-4">API 设置</h2>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg">
              <h3 className="font-semibold text-onBackground">Google Gemini API 密钥</h3>
              <p className="text-sm text-onBackground/70 mt-1 mb-3">
                要使用 AI 功能，您需要提供自己的 Google Gemini API 密钥。
                可以从 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a> 获取。
              </p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-onBackground/80 mb-1">API 密钥</label>
                  <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="在此输入您的 API 密钥"
                    className="w-full p-2 rounded-md bg-background border border-outline/50 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="modelName" className="block text-sm font-medium text-onBackground/80 mb-1">模型名称</label>
                  <input
                    id="modelName"
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="例如: gemini-1.5-flash-latest"
                    className="w-full p-2 rounded-md bg-background border border-outline/50 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveSettings}>保存设置</Button>
              </div>
              {saveStatus && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 text-right">{saveStatus}</p>
              )}
            </div>
          </div>
        </div>

        {/* 外观设置 */}
        <div className="bg-surface rounded-xl p-6 border border-outline/20">
          <h2 className="text-2xl font-bold text-onSurface mb-4">外观</h2>
          
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <h3 className="font-semibold text-onBackground">主题模式</h3>
              <p className="text-sm text-onBackground/70">选择浅色或深色主题</p>
            </div>
            <Button onClick={toggleTheme} variant="outline">
              {theme === 'light' ? (
                <>
                  <MoonIcon className="w-5 h-5 mr-2" />
                  切换到深色
                </>
              ) : (
                <>
                  <SunIcon className="w-5 h-5 mr-2" />
                  切换到浅色
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 数据管理部分 */}
        <div className="bg-surface rounded-xl p-6 border border-outline/20">
          <h2 className="text-2xl font-bold text-onSurface mb-4">数据管理</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h3 className="font-semibold text-onBackground">导出数据</h3>
                <p className="text-sm text-onBackground/70">备份所有角色和内容数据到本地文件</p>
              </div>
              <Button onClick={handleExport} variant="outline">
                <DownloadIcon className="w-5 h-5 mr-2" />
                导出
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h3 className="font-semibold text-onBackground">导入数据</h3>
                <p className="text-sm text-onBackground/70">从备份文件恢复角色和内容数据</p>
              </div>
              <Button 
                onClick={handleImportClick} 
                variant="outline" 
                disabled={isImporting}
              >
                <UploadIcon className="w-5 h-5 mr-2" />
                {isImporting ? '导入中...' : '导入'}
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {importStatus && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              importStatus.includes('失败') 
                ? 'bg-errorContainer text-onErrorContainer' 
                : 'bg-successContainer text-onSuccessContainer'
            }`}>
              {importStatus}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="bg-surface rounded-xl p-6 border border-outline/20">
          <h2 className="text-2xl font-bold text-onSurface mb-4">统计信息</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-onBackground">{personas.length}</div>
              <div className="text-sm text-onBackground/70">个角色</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-onBackground">{allItems.length}</div>
              <div className="text-sm text-onBackground/70">条内容</div>
            </div>
          </div>
        </div>

        {/* 关于部分 */}
        <div className="bg-surface rounded-xl p-6 border border-outline/20">
          <h2 className="text-2xl font-bold text-onSurface mb-4">关于</h2>
          <div className="space-y-2 text-onBackground/80">
            <p><strong>应用名称:</strong> 灵感流 (Inspoflow)</p>
            <p><strong>版本:</strong> 1.0.0</p>
            <p><strong>AI 引擎:</strong> Google Gemini</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;