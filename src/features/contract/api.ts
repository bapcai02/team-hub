import apiClient from '../../lib/apiClient';
import { Contract, ContractTemplate, ContractStats } from './types';

export const contractApi = {
  // Contracts
  getContracts: (params?: { page?: number; search?: string; status?: string }) =>
    apiClient.get('/contracts', { params }),

  getContract: (id: number) =>
    apiClient.get(`/contracts/${id}`),

  createContract: (data: Partial<Contract>) =>
    apiClient.post('/contracts', data),

  updateContract: (id: number, data: Partial<Contract>) =>
    apiClient.put(`/contracts/${id}`, data),

  deleteContract: (id: number) =>
    apiClient.delete(`/contracts/${id}`),

  // Templates
  getTemplates: (params?: { page?: number; search?: string; type?: string }) =>
    apiClient.get('/contracts/templates', { params }),

  getTemplate: (id: number) =>
    apiClient.get(`/contracts/templates/${id}`),

  createTemplate: (data: Partial<ContractTemplate>) =>
    apiClient.post('/contracts/templates', data),

  updateTemplate: (id: number, data: Partial<ContractTemplate>) =>
    apiClient.put(`/contracts/templates/${id}`, data),

  deleteTemplate: (id: number) =>
    apiClient.delete(`/contracts/templates/${id}`),

  // Stats
  getStats: () =>
    apiClient.get('/contracts/stats'),

  // PDF Generation
  generatePDF: (id: number) =>
    apiClient.post(`/contracts/${id}/generate-pdf`),

  // Signatures
  getSignatures: (contractId: number) =>
    apiClient.get(`/contracts/${contractId}/signatures`),

  addSignature: (contractId: number, data: any) =>
    apiClient.post(`/contracts/${contractId}/signatures`, data),

  // Parties
  getParties: (contractId: number) =>
    apiClient.get(`/contracts/${contractId}/parties`),

  addParty: (contractId: number, data: any) =>
    apiClient.post(`/contracts/${contractId}/parties`, data),
}; 