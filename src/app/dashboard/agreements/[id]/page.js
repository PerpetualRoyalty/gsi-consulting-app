'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiArrowLeft,
  HiCheckCircle,
  HiArrowDownTray,
  HiCalendarDays,
  HiCurrencyDollar,
} from 'react-icons/hi2';

export default function AgreementDetail() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Sample agreement data - in real app, would come from API
  const agreement = {
    id: params.id,
    name: 'Strategy Consulting Agreement',
    type: 'Consulting Services',
    amount: '$15,000',
    status: 'active',
    signedDate: '2024-01-15',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    signedBy: 'John Doe',
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1e3a5f';
    }
  }, []);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getTouchPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = e.touches ? getTouchPos(e) : getMousePos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const pos = e.touches ? getTouchPos(e) : getMousePos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveSignature = () => {
    if (!hasDrawn) {
      alert('Please draw your signature before saving');
      return;
    }
    setIsSigned(true);
    alert('Signature saved successfully! Your agreement has been signed.');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/agreements"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <HiArrowLeft className="w-5 h-5" />
        Back to Agreements
      </Link>

      {/* Agreement Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {agreement.name}
            </h1>
            <p className="text-gray-600 mt-2">{agreement.type}</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded transition">
            <HiArrowDownTray className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Amount</p>
            <p className="text-xl font-semibold text-gray-900 mt-1 flex items-center gap-2">
              <HiCurrencyDollar className="w-5 h-5" />
              {agreement.amount}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Start Date</p>
            <p className="text-xl font-semibold text-gray-900 mt-1 flex items-center gap-2">
              <HiCalendarDays className="w-5 h-5" />
              {agreement.startDate}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">End Date</p>
            <p className="text-xl font-semibold text-gray-900 mt-1 flex items-center gap-2">
              <HiCalendarDays className="w-5 h-5" />
              {agreement.endDate}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-700 text-sm font-medium">Status</p>
            <p className="text-xl font-semibold text-green-900 mt-1 flex items-center gap-2">
              <HiCheckCircle className="w-5 h-5" />
              {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
        <div className="prose prose-sm max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            CONSULTING SERVICES AGREEMENT
          </h2>

          <p className="text-gray-700 mb-4">
            This Consulting Services Agreement ("Agreement") is entered into as of the{' '}
            <strong>{agreement.startDate}</strong>, between the consulting firm and client
            as outlined above.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            1. Services
          </h3>
          <p className="text-gray-700 mb-4">
            The Consultant agrees to provide professional consulting services as mutually
            agreed upon between the parties. Services include strategic planning, business
            analysis, project management, and implementation support.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            2. Compensation
          </h3>
          <p className="text-gray-700 mb-4">
            The Client agrees to pay the Consultant a total fee of <strong>{agreement.amount}</strong> for
            the services rendered under this Agreement. Payment terms are net 30 days from
            invoice date.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            3. Term
          </h3>
          <p className="text-gray-700 mb-4">
            This Agreement shall commence on <strong>{agreement.startDate}</strong> and shall
            continue through <strong>{agreement.endDate}</strong>, unless earlier terminated by
            either party with 30 days written notice.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            4. Confidentiality
          </h3>
          <p className="text-gray-700 mb-4">
            Both parties agree to maintain the confidentiality of any proprietary
            information shared during the course of this engagement and for a period of
            two (2) years following the termination of this Agreement.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            5. Intellectual Property
          </h3>
          <p className="text-gray-700 mb-4">
            Any work product, deliverables, and intellectual property created as part of
            this engagement shall be owned by the Client. The Consultant retains the right
            to use general methodologies and frameworks developed independently.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            6. Independent Contractor
          </h3>
          <p className="text-gray-700 mb-4">
            The Consultant is an independent contractor and is not an employee of the
            Client. The Consultant is responsible for all taxes, insurance, and other
            statutory obligations.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            7. Termination
          </h3>
          <p className="text-gray-700 mb-4">
            Either party may terminate this Agreement with 30 days written notice. Upon
            termination, the Client shall pay for all services rendered through the
            termination date.
          </p>
        </div>

        {/* Signature Section */}
        <div className="border-t border-gray-300 pt-8 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Electronic Signature
          </h3>

          {!isSigned ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Draw your signature below:
                </label>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                  <canvas
                    ref={canvasRef}
                    className="w-full bg-white cursor-crosshair"
                    style={{ height: '200px' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use your mouse or touch device to sign
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearSignature}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={saveSignature}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Sign Agreement
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="flex items-center gap-2 text-green-900 font-medium">
                <HiCheckCircle className="w-5 h-5" />
                Agreement signed on {new Date().toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {agreement.amount}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-900 text-sm">Invoice Status</p>
            <p className="text-2xl font-semibold text-blue-900 mt-2">Not Yet Due</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <p className="text-gray-600 text-sm">Payment Terms</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">Net 30</p>
          </div>
        </div>
      </div>
    </div>
  );
}
