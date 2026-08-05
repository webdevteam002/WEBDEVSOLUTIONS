'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import { addProjectAction } from '@/actions/addProject';
import { deleteProjectAction, editProjectAction } from '@/actions/projectActions';
import Image from 'next/image';

interface ProjectData {
  _id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  imageUrl: string;
}

export function DashboardClient({ initialProjects }: { initialProjects: ProjectData[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  async function handleLogout() {
    await logoutAction();
    router.push('/admin/login');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingProject) {
      result = await editProjectAction(editingProject._id, formData);
    } else {
      result = await addProjectAction(formData);
    }

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ 
        type: 'success', 
        text: editingProject ? 'Project updated successfully!' : 'Project added successfully!' 
      });
      
      if (!editingProject) {
        (e.target as HTMLFormElement).reset();
      } else {
        setEditingProject(null);
      }
      
      router.refresh();
    }
    
    setIsSubmitting(false);
  }

  function handleEditClick(project: ProjectData) {
    setEditingProject(project);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingProject(null);
    setMessage(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setIsDeleting(id);
    const result = await deleteProjectAction(id);
    
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsDeleting(null);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors text-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Form Column */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 h-fit">
            <h2 className="text-xl font-semibold mb-6">
              {editingProject ? `Edit Project: ${editingProject.title}` : 'Create New Project'}
            </h2>
            
            {message && (
              <div className={`mb-6 p-4 rounded-md border ${message.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-200' : 'bg-red-500/20 border-red-500/50 text-red-200'}`}>
                {message.text}
              </div>
            )}

            <form key={editingProject?._id || 'new'} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                  <input 
                    name="title" 
                    type="text" 
                    required
                    defaultValue={editingProject?.title || ''}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select 
                    name="category"
                    required
                    defaultValue={editingProject?.category || 'Web App'}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Web App">Web App</option>
                    <option value="Frontend UI">Frontend UI</option>
                    <option value="AI Solutions">AI Solutions</option>
                    <option value="Healthcare Tech">Healthcare Tech</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="3D & Interactive">3D & Interactive</option>
                    <option value="E-Commerce">E-Commerce</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea 
                  name="description" 
                  required
                  rows={4}
                  defaultValue={editingProject?.description || ''}
                  className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack (comma separated)</label>
                <input 
                  name="techStack" 
                  type="text" 
                  placeholder="e.g. Next.js, Tailwind, MongoDB"
                  required
                  defaultValue={editingProject?.techStack?.join(', ') || ''}
                  className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">Project Image</label>
                  <div className="flex bg-black/40 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${uploadMode === 'file' ? 'bg-cyan-500 text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${uploadMode === 'url' ? 'bg-cyan-500 text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {uploadMode === 'file' ? (
                  <input 
                    name="imageFile" 
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                  />
                ) : (
                  <input 
                    name="imageUrl" 
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    defaultValue={editingProject?.imageUrl || ''}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                )}
              </div>

              <div className="flex gap-4 mt-4">
                {editingProject && (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting 
                    ? (editingProject ? 'Updating...' : 'Creating Project...') 
                    : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>

          {/* Project List Column */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8">
            <h2 className="text-xl font-semibold mb-6 flex justify-between items-center">
              Existing Projects 
              <span className="text-sm bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">{initialProjects.length}</span>
            </h2>
            
            <div className="space-y-4 overflow-y-auto max-h-[750px] pr-2 custom-scrollbar">
              {initialProjects.length === 0 ? (
                <div className="text-gray-400 text-center py-8 border border-white/10 border-dashed rounded-lg">
                  No projects found in MongoDB.
                </div>
              ) : (
                initialProjects.map((project) => (
                  <div key={project._id} className="flex gap-4 p-4 border border-white/10 rounded-lg bg-black/20 hover:border-cyan-500/50 transition-colors">
                    <div className="w-24 h-24 relative rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                      {project.imageUrl && (
                        <Image 
                          src={project.imageUrl} 
                          alt={project.title} 
                          fill 
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-lg truncate text-white" title={project.title}>
                            {project.title}
                          </h3>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 ml-2 whitespace-nowrap">
                            {project.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 leading-snug">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-3">
                        <div className="text-xs text-cyan-400 truncate pr-4">
                          {project.techStack.join(', ')}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(project)}
                            className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded transition-colors flex-shrink-0"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            disabled={isDeleting === project._id}
                            className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            {isDeleting === project._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
