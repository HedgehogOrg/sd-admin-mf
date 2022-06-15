import { Platform } from './enums';

// 项目内业务相关的配置
localStorage.setItem('BASE_URL', process.env.BASE_URL || '');
localStorage.setItem('PLATFORM', Platform.ORGANIZATION.toString());
localStorage.setItem('USE_MOCK', process.env.USE_MOCK || '');

/**
 * for模块联邦
 */
import('./bootstrap');

export {};
