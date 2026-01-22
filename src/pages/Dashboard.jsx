import React, { useState } from 'react';
import { FaCheckCircle, FaThumbsUp } from 'react-icons/fa';
import { FiClock, FiFileText, FiSearch, FiSend, FiUserCheck } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LuClipboardList } from 'react-icons/lu';
import { BiUpload } from 'react-icons/bi';
import { GrClose } from 'react-icons/gr';
import { IoAlertCircleOutline } from 'react-icons/io5';


const statusConfig = {
  SUBMITTED: {
    label: 'Submitted',
    class: 'status-submitted',
    icon: FaCheckCircle,
    description: 'Your case has been received and is waiting for review.'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    class: 'status-review',
    icon: FiSearch,
    description: 'A medical professional is reviewing your symptoms.'
  },
  SPECIALIST_SUGGESTED: {
    label: 'Specialist Suggested',
    class: 'status-suggested',
    icon: FiUserCheck,
    description: 'A specialist has been recommended for your case.'
  },
  APPROVED: {
    label: 'Approved',
    class: 'status-approved',
    icon: FaThumbsUp,
    description: 'Your appointment has been approved. You can now book.'
  },
};

const severityOptions = [
  { value: 'mild', label: 'Mild - Manageable discomfort' },
  { value: 'moderate', label: 'Moderate - Affecting daily activities' },
  { value: 'severe', label: 'Severe - Significant impact on quality of life' },
];

function Dashboard() {
  const {user, isLoading, submitSymptoms, getUserCases, isAuthenticated } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const [formData, setFormData] = useState({
    primarySymptoms: '',
    duration: '',
    severity: '',
    additionalNotes: '',
  });

  const cases = getUserCases();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.primarySymptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }
    if (!formData.duration.trim()) {
      toast.error('Please specify the duration');
      return;
    }
    if (!formData.severity) {
      toast.error('Please select severity level');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitSymptoms({
        ...formData,
        hasReport: !!fileName,
        reportName: fileName
      });
      
      toast.success('Symptoms submitted successfully! Your case ID has been assigned.');
      setShowForm(false);
      setFormData({
        primarySymptoms: '',
        duration: '',
        severity: '',
        additionalNotes: '',
      });
      setFileName('');
    } catch (error) {
      toast.error('Failed to submit symptoms');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your symptom submissions and track your case status.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Submit Symptoms Card */}
          <div className="card-medical animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl [background:var(--gradient-primary)] flex items-center justify-center shrink-0 shadow-soft">
                <LuClipboardList className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-foreground mb-1">
                  Submit Symptoms
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Describe your symptoms to get matched with the right specialist.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary text-sm cursor-pointer"
                >
                  New Submission
                </button>
              </div>
            </div>
          </div>

          {/* Status Overview Card */}
          <div className="card-medical animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <FiClock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-foreground mb-1">
                  Active Cases
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  You have {cases.length} case{cases.length !== 1 ? 's' : ''} on record.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {cases.length > 0 && (
                    <span className="status-badge status-submitted text-xs">
                      {cases.filter(c => c.status === 'SUBMITTED').length} Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="text-xl font-semibold text-foreground mb-4">
            Your Cases
          </p>

          {cases.length == 0 ? (
            <div className="card-medical text-center py-12">
              <FiFileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                No cases yet
              </p>
              <p className="text-muted-foreground mb-4">
                Submit your first symptoms to get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary cursor-pointer"
              >
                Submit Symptoms
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((caseItem) => {
                const status = statusConfig[caseItem.status] || statusConfig.SUBMITTED;
                const StatusIcon = status.icon;

                return (
                  <div key={caseItem.id} className="card-medical">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="tracking-wider text-sm text-primary font-semibold">
                            {caseItem.id}
                          </span>
                          <span className={`status-badge ${status.class}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            <span>{status.label}</span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {formatDate(caseItem.submittedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Primary Symptoms:</span>
                        <p className="text-foreground mt-1">{caseItem.primarySymptoms}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="text-foreground mt-1">{caseItem.duration}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Severity:</span>
                        <p className="text-foreground mt-1 capitalize">{caseItem.severity}</p>
                      </div>
                    </div>

                    {/* Status Info */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-start gap-2">
                        <IoAlertCircleOutline className="w-4 h-4 text-primary mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          {status.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Symptom Submission Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-auto animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Submit Symptoms
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              >
                <GrClose className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Primary Symptoms */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Symptoms *
                </label>
                <textarea
                  name="primarySymptoms"
                  value={formData.primarySymptoms}
                  onChange={handleChange}
                  placeholder="Describe your main symptoms in detail..."
                  rows={3}
                  className="input-medical resize-none"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 3 days, 2 weeks, 1 month"
                  className="input-medical"
                  required
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Severity *
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="input-medical"
                  required
                >
                  <option value="">Select severity level</option>
                  {severityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any additional information, medical history, or concerns..."
                  rows={2}
                  className="input-medical resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Medical Report (Optional)
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <BiUpload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {fileName || 'Click to upload a file'}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard