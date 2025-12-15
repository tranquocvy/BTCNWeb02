import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../services/api/endpoints/auth'
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'

export default function Profile() {
  const { user: contextUser, login } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ email: '', phone: '', dob: '' })
  const [saveMessage, setSaveMessage] = useState(null)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile()
        setProfile(data)
        setFormData({
          email: data.email || '',
          phone: data.phone || '',
          dob: data.dob ? data.dob.split('T')[0] : '',
        })
      } catch (err) {
        setError(err.message || String(err))
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaveMessage(null)
    setSaveError(null)
    try {
      const updated = await updateUserProfile(formData)
      setProfile(updated)
      if (contextUser) {
        login({ ...contextUser, ...updated }, localStorage.getItem('auth_token'))
      }
      setSaveMessage('Cập nhật thông tin thành công!')
      setIsEditing(false)
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      setSaveError(err.message || String(err))
    }
  }

  const handleCancel = () => {
    setFormData({
      email: profile.email || '',
      phone: profile.phone || '',
      dob: profile.dob ? profile.dob.split('T')[0] : '',
    })
    setIsEditing(false)
    setSaveError(null)
  }

  // Generate avatar color based on username
  const getAvatarColor = (username) => {
    if (!username) return '#682480'
    const colors = ['#682480', '#3864CC', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#7c3aed']
    const index = username.charCodeAt(0) % colors.length
    return colors[index]
  }

  const getInitials = (username) => {
    if (!username) return 'U'
    return username.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="py-8 text-center">Đang tải...</div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="py-8 text-center text-red-500">Lỗi: {error}</div>
      </MainLayout>
    )
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="py-8 text-center">Không tìm thấy thông tin</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="py-8">
        {/* Profile Header */}
        <div className="text-left bg-gradient-to-br from-[#682480] to-[#3864CC] dark:from-[#3b1464] dark:to-[#123066] rounded-lg p-8 mb-6">
          <div className="flex items-center gap-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: getAvatarColor(profile.username) }}
            >
              {getInitials(profile.username)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{profile.username || 'User'}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{profile.email || 'Chưa có email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  <span className="capitalize">{profile.role || 'user'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition"
                >
                  <Edit2 size={18} />
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition"
                  >
                    <Save size={18} />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 rounded-lg">
            {saveMessage}
          </div>
        )}
        {saveError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 rounded-lg">
            {saveError}
          </div>
        )}

        {/* Profile Content */}
        <div className="text-left bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Username (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User size={16} />
                Tên đăng nhập
              </label>
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {profile.username || 'N/A'}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {formData.email || 'N/A'}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone size={16} />
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {formData.phone || 'N/A'}
                </div>
              )}
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Ngày sinh
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {formData.dob || 'N/A'}
                </div>
              )}
            </div>

            {/* Role (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Shield size={16} />
                Vai trò
              </label>
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                <span className="capitalize">{profile.role || 'user'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
