'use client';

import { useState } from 'react';
import { Send, CheckCircle2, User, Phone, FileText, Image as ImageIcon, Type, Sparkles, X, MapPin } from 'lucide-react';

export default function CitizenReporterForm() {
  const [formData, setFormData] = useState({
    reporterName: '',
    mobileNumber: '',
    headline: '',
    category: '',
    summary: '',
    details: '',
    location: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('మీ బ్రౌజర్ స్థాన సేవను సపోర్ట్ చేయదు (Geolocation is not supported by your browser)');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData(prev => ({ ...prev, location: mapsUrl }));
        setLocationLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationLoading(false);
        let errorMsg = 'స్థానాన్ని పొందడంలో విఫలమైంది (Failed to get location)';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'స్థాన అనుమతి తిరస్కరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్లలో అనుమతించండి (Location permission denied. Please enable it in browser settings)';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'స్థాన సమాచారం అందుబాటులో లేదు (Location information is unavailable)';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'స్థానాన్ని పొందడం సమయం మించిపోయింది (Request to get location timed out)';
        }
        setLocationError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location) {
      setLocationError('దయచేసి మీ ప్రస్తుత స్థానాన్ని గుర్తించండి (Please determine your current location)');
      return;
    }
    setIsSubmitting(true);
    
    const categoryNames: Record<string, string> = {
      'telangana': 'తెలంగాణ (Telangana)',
      'andhra-pradesh': 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)',
      'national': 'జాతీయం (National)',
      'international': 'అంతర్జాతీయం (International)',
      'business': 'వ్యాపారం (Business)',
      'sports': 'క్రీడలు (Sports)',
      'entertainment': 'సినిమా (Film)',
      'other': 'ఇతర వార్తలు (Other)'
    };
    
    const readableCategory = categoryNames[formData.category] || formData.category;

    const message = `*సిటిజన్ రిపోర్టర్ వార్తా సమాచారం (Citizen Reporter Submission)*

*రిపోర్టర్ పేరు (Name):* ${formData.reporterName}
*మొబైల్ సంఖ్య (Mobile):* ${formData.mobileNumber}
*వార్త శీర్షిక (Headline):* ${formData.headline}
*వార్త వర్గం (Category):* ${readableCategory}
*వార్త సారాంశం (Summary):* ${formData.summary}
*పూర్తి వివరాలు (Details):* ${formData.details}
*ప్రస్తుత స్థానం (Location Link):* ${formData.location}`;

    const whatsappUrl = `https://wa.me/919705999515?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        reporterName: '',
        mobileNumber: '',
        headline: '',
        category: '',
        summary: '',
        details: '',
        location: '',
      });
      setImagePreview(null);
      
      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="w-full bg-white border border-gray-150 rounded-2xl shadow-xl p-6 md:p-10 text-center select-none animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner animate-pulse">
            <CheckCircle2 size={48} className="stroke-[2.5]" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 telugu-text mb-4" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          మీ వార్త విజయవంతంగా పంపబడింది!
        </h2>
        <div className="text-gray-600 space-y-3 text-[15px] md:text-base leading-relaxed telugu-text mb-8 max-w-[500px] mx-auto" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          <p>ధన్యవాదాలు! మీరు పంపిన వార్తా సమాచారాన్ని మా సంపాదక బృందం స్వీకరించింది.</p>
          <p className="bg-blue-50/50 text-[#02599c] px-4 py-3 rounded-lg border border-blue-100 font-bold">
            మా డెస్క్ బృందం ఈ వార్తను పరిశీలించి, సత్యసంధతను ధృవీకరించిన తర్వాత వెబ్‌సైట్‌లో ప్రచురిస్తుంది.
          </p>
        </div>
        <button
          onClick={() => setIsSubmitted(false)}
          className="inline-flex items-center gap-2 bg-[#cc0000] hover:bg-[#e60000] text-white font-black px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer telugu-text text-[15px]"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          మరొక వార్తను పంపండి
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-150 rounded-2xl shadow-xl overflow-hidden select-none text-left">
      {/* Top Banner Header */}
      <div className="bg-[#cc0000] p-6 text-white text-center relative overflow-hidden">
        {/* Subtle background circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <h2 className="text-2xl md:text-3xl font-black telugu-text flex items-center justify-center gap-2 mb-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          <Sparkles className="animate-spin w-6 h-6 shrink-0" style={{ animationDuration: '6s' }} />
          సిటిజన్ రిపోర్టర్ (Citizen Reporter)
        </h2>
        <p className="text-[13px] md:text-[15px] font-bold opacity-90 telugu-text max-w-[600px] mx-auto leading-relaxed" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          మీరు సేకరించిన వార్తలను ఇక్కడ సమర్పించండి. మా డెస్క్ బృందం ఆ వార్తలను ధృవీకరించి ప్రచురిస్తుంది.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Reporter Info Row (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              <User size={15} className="text-[#cc0000]" />
              రిపోర్టర్ పేరు <span className="text-[#cc0000]">*</span>
            </label>
            <input
              type="text"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleInputChange}
              required
              placeholder="మీ పేరు రాయండి"
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#cc0000] focus:bg-white rounded-xl px-4 py-2.5 text-[14.5px] font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 indent-2"
              style={{ textIndent: '8px' }}
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              <Phone size={15} className="text-[#cc0000]" />
              మొబైల్ సంఖ్య <span className="text-[#cc0000]">*</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              placeholder="10 అంకెల మొబైల్ సంఖ్య"
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#cc0000] focus:bg-white rounded-xl px-4 py-2.5 text-[14.5px] font-semibold text-gray-800 outline-none transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* News Headline & Category Row (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Headline Field */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              <Type size={15} className="text-[#cc0000]" />
              వార్త శీర్షిక (Headline) <span className="text-[#cc0000]">*</span>
            </label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleInputChange}
              required
              placeholder="వార్తకు సరిపోయే ముఖ్యమైన శీర్షిక రాయండి"
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#cc0000] focus:bg-white rounded-xl px-4 py-2.5 text-[14.5px] font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 indent-2"
              style={{ textIndent: '8px' }}
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              వార్త వర్గం (Category) <span className="text-[#cc0000]">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#cc0000] focus:bg-white rounded-xl px-4 py-2.5 text-[14px] font-bold text-gray-700 outline-none transition-all cursor-pointer"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              <option value="" disabled>వర్గాన్ని ఎంచుకోండి</option>
              <option value="telangana">తెలంగాణ (Telangana)</option>
              <option value="andhra-pradesh">ఆంధ్రప్రదేశ్ (Andhra Pradesh)</option>
              <option value="national">జాతీయం (National)</option>
              <option value="international">అంతర్జాతీయం (International)</option>
              <option value="business">వ్యాపారం (Business)</option>
              <option value="sports">క్రీడలు (Sports)</option>
              <option value="entertainment">సినిమా (Film)</option>
              <option value="other">ఇతర వార్తలు (Other)</option>
            </select>
          </div>
        </div>

        {/* Short Description summary */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            <FileText size={15} className="text-[#cc0000]" />
            వార్త సారాంశం (Summary) <span className="text-[#cc0000]">*</span>
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            rows={2}
            placeholder="వార్త గురించిన చిన్న సారాంశాన్ని ఇక్కడ రాయండి"
            className="w-full bg-gray-50 border border-gray-200 focus:border-[#cc0000] focus:bg-white rounded-xl px-4 py-2.5 text-[14.5px] font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 resize-y"
          />
        </div>

        {/* Full News Details */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            <FileText size={15} className="text-[#cc0000]" />
            పూర్తి వార్తా సమాచారం (Full News Details) <span className="text-[#cc0000]">*</span>
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            required
            rows={5}
            placeholder="వార్తకు సంబంధించిన పూర్తి వివరాలను ఇక్కడ వివరించండి (ఎక్కడ జరిగింది, ఎప్పుడు జరిగింది మొదలైనవి)"
            className="w-full bg-gray-50 border border-gray-200 focus:border-[#cc0000] focus:bg-white rounded-xl px-4 py-2.5 text-[14.5px] font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 resize-y"
          />
        </div>

        {/* Current Location Field */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            <MapPin size={15} className="text-[#cc0000]" />
            ప్రస్తుత స్థానం (Current Location) <span className="text-[#cc0000]">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className={`inline-flex items-center justify-center gap-2 bg-[#02599c] hover:bg-[#036bb8] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 text-[14px] telugu-text ${
                locationLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  స్థానాన్ని గుర్తిస్తోంది...
                </>
              ) : (
                <>
                  <MapPin size={16} />
                  స్థానాన్ని గుర్తించండి (Get Location)
                </>
              )}
            </button>
            <input
              type="url"
              name="location"
              value={formData.location}
              readOnly
              required
              placeholder="స్థానాన్ని గుర్తించడానికి పై బటన్ పై క్లిక్ చేయండి"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-gray-700 outline-none transition-all placeholder-gray-400 cursor-not-allowed"
            />
          </div>
          {locationError && (
            <p className="text-[12.5px] text-[#cc0000] font-semibold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              {locationError}
            </p>
          )}
        </div>

        {/* Image Attachment File Zone */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-extrabold text-gray-700 telugu-text flex items-center gap-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            <ImageIcon size={15} className="text-[#cc0000]" />
            చిత్రం / ఫోటో జోడించండి (Attach Image/Photo)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            
            {/* File Upload Zone */}
            <div className="relative border-2 border-dashed border-gray-200 hover:border-[#cc0000] rounded-2xl p-4 md:p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-red-50/10">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-1">
                <ImageIcon className="text-gray-400 w-8 h-8 shrink-0 mb-1" />
                <span className="text-[13px] font-bold text-gray-600 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ఫోటో అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి
                </span>
                <span className="text-[11px] text-gray-400 font-sans uppercase">PNG, JPG or JPEG format</span>
              </div>
            </div>

            {/* Upload Preview */}
            <div className="h-[120px] md:h-[135px] border border-gray-150 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-inner">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="News attachment preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md transition-colors"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 gap-1 select-none">
                  <ImageIcon size={24} />
                  <span className="text-[12px] font-semibold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ప్రివ్యూ ఇక్కడ కనిపిస్తుంది</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Form Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-[#e60000] text-white font-black px-8 py-3 rounded-xl transition-all shadow-md active:scale-[0.98] select-none cursor-pointer w-full md:w-auto telugu-text text-[15.5px] ${
              isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
            }`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                సమర్పిస్తోంది...
              </>
            ) : (
              <>
                <Send size={16} />
                వార్తను సమర్పించండి
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
