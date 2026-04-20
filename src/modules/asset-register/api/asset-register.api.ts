import { api } from '@shared/config/api-client'
import type { AssetRegisterEntry, AssetType, AssetVerifiedStatus } from '@shared/types/academy'

export interface AssetCreate {
  asset_name: string
  asset_type: AssetType
  drive_path: string
}

export const assetRegisterApi = {
  list:   (month: string) => api.get<AssetRegisterEntry[]>(`/academy/asset-register-entries?month=${month}`),
  create: (body: AssetCreate) => api.post<AssetRegisterEntry>('/academy/asset-register-entries', body),
  update: (id: string, body: { verified_status?: AssetVerifiedStatus }) =>
    api.patch<AssetRegisterEntry>(`/academy/asset-register-entries/${id}`, body),
}
