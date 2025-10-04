import React, { useState } from 'react';
import { Check } from 'lucide-react';
import RoleBasedNavbar from '../components/RoleBasedNavbar';

export default function ApprovalRulesAdmin() {
  const [approvers, setApprovers] = useState([
    { id: 1, name: 'John', required: true },
    { id: 2, name: 'Mitchell', required: false },
    { id: 3, name: 'Andreas', required: false }
  ]);

  const [isManager, setIsManager] = useState(true);
  const [sequenceEnabled, setSequenceEnabled] = useState(false);
  const [minApprovalPercent, setMinApprovalPercent] = useState('');

  const toggleRequired = (id) => {
    setApprovers(approvers.map(approver => 
      approver.id === id ? { ...approver, required: !approver.required } : approver
    ));
  };

  return (
    <div className="min-h-screen bg-base-100" data-theme="light">
      <RoleBasedNavbar />
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-8 text-center">Admin View (Approval Rules)</h1>

        {/* Main Container */}
        <div className="card bg-base-100 shadow-xl border border-base-300 w-full">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Section */}
              <div className="space-y-6">
                {/* User Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">User</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter user name" 
                    className="input input-bordered w-full" 
                    defaultValue="marc"
                  />
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">Description about rules</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-20" 
                    placeholder="Enter approval rule description"
                    defaultValue="Approval rule for miscellaneous expenses"
                  ></textarea>
                </div>

                {/* Manager Dropdown */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">Manager</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>Sarah</option>
                    <option>John</option>
                    <option>Mitchell</option>
                    <option>Andreas</option>
                  </select>
                  <label className="label">
                    <span className="label-text-alt text-xs">
                      Dynamic dropdown - Initially the manager set on user record should be set, admin can change manager for approval if required.
                    </span>
                  </label>
                </div>

                {/* Is Manager Approver Checkbox */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary" 
                      checked={isManager}
                      onChange={(e) => setIsManager(e.target.checked)}
                    />
                    <span className="label-text font-semibold">Is manager an approver?</span>
                  </label>
                  <p className="text-sm text-gray-600 mt-2 ml-8">
                    If checked, the approval request goes to the manager first before other approvers.
                  </p>
                </div>
              </div>

              {/* Right Section - Approvers */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Approvers</h2>
                  
                  <div className="space-y-4">
                    {approvers.map((approver, index) => (
                      <div key={approver.id} className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                        <span className="text-2xl font-bold text-gray-500">{index + 1}</span>
                        <input 
                          type="text" 
                          className="input input-bordered flex-1" 
                          value={approver.name}
                          readOnly
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">Required</span>
                          <div 
                            className={`w-10 h-10 border-2 rounded flex items-center justify-center cursor-pointer ${
                              approver.required ? 'bg-primary border-primary' : 'border-base-300 bg-white'
                            }`}
                            onClick={() => toggleRequired(approver.id)}
                          >
                            {approver.required && <Check className="text-white" size={24} />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approvers Sequence */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary" 
                      checked={sequenceEnabled}
                      onChange={(e) => setSequenceEnabled(e.target.checked)}
                    />
                    <span className="label-text font-semibold">Approvers Sequence</span>
                  </label>
                </div>

                {/* Minimum Approval Percentage */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">Minimum Approval Percentage</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="input input-bordered w-32" 
                      placeholder="0"
                      value={minApprovalPercent}
                      onChange={(e) => setMinApprovalPercent(e.target.value)}
                    />
                    <span className="text-lg">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end mt-8">
              <button className="btn btn-outline btn-error">Cancel</button>
              <button className="btn btn-primary">Save Rule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}