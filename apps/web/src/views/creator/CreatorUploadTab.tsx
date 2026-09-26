import React, { useState, useEffect } from 'react';
import {
  Upload,
  Video,
  FileText,
  AlertCircle,
  MapPin,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Play,
  Camera,
  Layers,
  Check,
  RefreshCw,
  Globe,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Smartphone,
  Info,
  Radio,
  Film,
  HardDrive,
  Sparkles,
  Search,
  X,
  Sliders,
  CheckCircle
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { CreatorTab } from './types';
import {
  INDIA_LOCATIONS,
  getAllStates,
  getCitiesForState,
  getLocalAreasForCity
} from '@/data/indiaLocations';
import { supabase, getR2UploadUrl, uploadFileToR2 as uploadToR2Storage } from '@/lib/supabase';
import {
  getLgdStates,
  getLgdDistrictsByState,
  getLgdSubdistrictsByDistrict,
  getLgdLocalBodies,
  lookupLgdByPincode,
  LgdState,
  LgdDistrict,
  LgdSubdistrict,
  LgdLocalBody
} from '@/lib/lgdLocationService';

interface CreatorUploadTabProps {
  token: string | null;
  apiBase: string;
  fetchDashboard: () => Promise<void>;
  fetchContents: () => Promise<void>;
  setActiveTabNav: (tab: CreatorTab) => void;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  hindiName?: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'civic-issues', name: 'Civic Issues', slug: 'civic-issues' },
  { id: 'infrastructure', name: 'Infrastructure', slug: 'infrastructure' },
  { id: 'local', name: 'Local Governance', slug: 'local' },
  { id: 'crime', name: 'Crime & Safety', slug: 'crime' },
  { id: 'environment', name: 'Environment', slug: 'environment' },
  { id: 'agriculture', name: 'Agriculture', slug: 'agriculture' },
  { id: 'education', name: 'Education', slug: 'education' }
];

// Helper to guarantee clean English-only category presentation
const formatEnglishCategory = (name: string): string => {
  if (!name) return '';
  const match = name.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return name;
};

export type ContentFormat = 'SHORT_VIDEO' | 'LONG_VIDEO' | 'ARTICLE';

export interface VideoAnalysisResult {
  width: number;
  height: number;
  duration: number;
  aspectRatio: number;
  suggestedFormat: 'SHORT_VIDEO' | 'LONG_VIDEO';
  ratioLabel: string;
  resolutionLabel: string;
  durationFormatted: string;
}

export const CreatorUploadTab: React.FC<CreatorUploadTabProps> = ({
  token,
  apiBase,
  fetchDashboard,
  fetchContents,
  setActiveTabNav
}) => {
  const { rate, cpmRateText, usdToInr } = useCurrency();

  // Step workflow: 1 = Media Evidence, 2 = Story Details, 3 = Geofence & Category
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  // Format Selection: 2 Video Formats (Short 9:16 vs Long 16:9) + Photo Article
  const [contentFormat, setContentFormat] = useState<ContentFormat>('SHORT_VIDEO');
  
  // Video Analysis / Aspect Ratio Auto-detection
  const [detectedVideoMeta, setDetectedVideoMeta] = useState<VideoAnalysisResult | null>(null);
  
  // Story Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');
  const [mediaFileSize, setMediaFileSize] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('civic-issues');
  
  // Official LGD Geographic Hierarchy State
  const [lgdStates, setLgdStates] = useState<LgdState[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState<number>(10); // Bihar
  const [stateName, setStateName] = useState('Bihar');

  const [lgdDistricts, setLgdDistricts] = useState<LgdDistrict[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);
  const [cityName, setCityName] = useState('Patna');

  const [lgdSubdistricts, setLgdSubdistricts] = useState<LgdSubdistrict[]>([]);
  const [selectedSubdistrictCode, setSelectedSubdistrictCode] = useState<number | null>(null);
  const [subdistrictName, setSubdistrictName] = useState('Patna Sadar');

  const [lgdLocalBodies, setLgdLocalBodies] = useState<LgdLocalBody[]>([]);
  const [selectedLocalBodyCode, setSelectedLocalBodyCode] = useState<number | null>(null);
  const [areaName, setAreaName] = useState('Kankarbagh Ward 14');
  const [pincode, setPincode] = useState('800020');

  const [pincodeInput, setPincodeInput] = useState('');
  const [isSearchingPincode, setIsSearchingPincode] = useState(false);
  const [pincodeSuccessNote, setPincodeSuccessNote] = useState<string | null>(null);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSubdistricts, setLoadingSubdistricts] = useState(false);

  // Upload & Progress State (Supports up to 2GB with Cancellation)
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const uploadAbortControllerRef = React.useRef<AbortController | null>(null);
  const [submittingContent, setSubmittingContent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  // Initialize LGD Geographic Data on Mount
  useEffect(() => {
    let isMounted = true;
    const initLgd = async () => {
      try {
        const states = await getLgdStates();
        if (!isMounted) return;
        if (states && states.length > 0) {
          setLgdStates(states);
          const defaultState = states.find(s => s.state_name.toLowerCase() === 'bihar') || states[0];
          setSelectedStateCode(defaultState.state_code);
          setStateName(defaultState.state_name);

          const dists = await getLgdDistrictsByState(defaultState.state_code);
          if (!isMounted) return;
          setLgdDistricts(dists);

          if (dists && dists.length > 0) {
            const defaultDist = dists.find(d => d.district_name.toLowerCase() === 'patna') || dists[0];
            setSelectedDistrictCode(defaultDist.district_code);
            setCityName(defaultDist.district_name);

            const subs = await getLgdSubdistrictsByDistrict(defaultDist.district_code);
            if (!isMounted) return;
            setLgdSubdistricts(subs);
            if (subs && subs.length > 0) {
              const defaultSub = subs.find(s => s.subdistrict_name.toLowerCase().includes('patna')) || subs[0];
              setSelectedSubdistrictCode(defaultSub.subdistrict_code);
              setSubdistrictName(defaultSub.subdistrict_name);
            }

            const bodies = await getLgdLocalBodies(defaultState.state_code, defaultDist.district_code);
            if (!isMounted) return;
            setLgdLocalBodies(bodies);
            if (bodies && bodies.length > 0) {
              setPincode(bodies[0].pincode);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing LGD locations:', err);
      }
    };
    initLgd();
    return () => { isMounted = false; };
  }, []);

  // When state changes
  const handleLgdStateChange = async (newCodeNum: number) => {
    setSelectedStateCode(newCodeNum);
    const matchedState = lgdStates.find(s => s.state_code === newCodeNum);
    if (matchedState) {
      setStateName(matchedState.state_name);
    }
    setPincodeSuccessNote(null);
    setLoadingDistricts(true);
    try {
      const dists = await getLgdDistrictsByState(newCodeNum);
      setLgdDistricts(dists);
      if (dists.length > 0) {
        const firstDist = dists[0];
        setSelectedDistrictCode(firstDist.district_code);
        setCityName(firstDist.district_name);

        setLoadingSubdistricts(true);
        const subs = await getLgdSubdistrictsByDistrict(firstDist.district_code);
        setLgdSubdistricts(subs);
        if (subs.length > 0) {
          setSelectedSubdistrictCode(subs[0].subdistrict_code);
          setSubdistrictName(subs[0].subdistrict_name);
        } else {
          setSelectedSubdistrictCode(null);
          setSubdistrictName('');
        }
        setLoadingSubdistricts(false);

        const bodies = await getLgdLocalBodies(newCodeNum, firstDist.district_code);
        setLgdLocalBodies(bodies);
        if (bodies.length > 0) {
          setPincode(bodies[0].pincode);
          setAreaName(bodies[0].local_body_name);
          setSelectedLocalBodyCode(bodies[0].local_body_code);
        }
      } else {
        setSelectedDistrictCode(null);
        setCityName('');
        setLgdSubdistricts([]);
        setSelectedSubdistrictCode(null);
        setSubdistrictName('');
      }
    } finally {
      setLoadingDistricts(false);
    }
  };

  // When city / district changes
  const handleLgdDistrictChange = async (distCodeNum: number) => {
    setSelectedDistrictCode(distCodeNum);
    const matchedDist = lgdDistricts.find(d => d.district_code === distCodeNum);
    if (matchedDist) {
      setCityName(matchedDist.district_name);
    }
    setPincodeSuccessNote(null);
    setLoadingSubdistricts(true);
    try {
      const subs = await getLgdSubdistrictsByDistrict(distCodeNum);
      setLgdSubdistricts(subs);
      if (subs.length > 0) {
        setSelectedSubdistrictCode(subs[0].subdistrict_code);
        setSubdistrictName(subs[0].subdistrict_name);
      } else {
        setSelectedSubdistrictCode(null);
        setSubdistrictName('');
      }

      const bodies = await getLgdLocalBodies(selectedStateCode, distCodeNum);
      setLgdLocalBodies(bodies);
      if (bodies.length > 0) {
        setPincode(bodies[0].pincode);
        setAreaName(bodies[0].local_body_name);
        setSelectedLocalBodyCode(bodies[0].local_body_code);
      }
    } finally {
      setLoadingSubdistricts(false);
    }
  };

  // When subdistrict changes
  const handleLgdSubdistrictChange = async (subCodeNum: number) => {
    setSelectedSubdistrictCode(subCodeNum);
    const matchedSub = lgdSubdistricts.find(s => s.subdistrict_code === subCodeNum);
    if (matchedSub) {
      setSubdistrictName(matchedSub.subdistrict_name);
    }
    const bodies = await getLgdLocalBodies(selectedStateCode, selectedDistrictCode || undefined, subCodeNum);
    if (bodies.length > 0) {
      setLgdLocalBodies(bodies);
      setPincode(bodies[0].pincode);
      setAreaName(bodies[0].local_body_name);
      setSelectedLocalBodyCode(bodies[0].local_body_code);
    }
  };

  // Quick 6-digit PIN code auto-fill resolver
  const handlePincodeSearch = async (val: string) => {
    setPincodeInput(val);
    const clean = val.trim().replace(/\D/g, '');
    if (clean.length === 6) {
      setIsSearchingPincode(true);
      try {
        const results = await lookupLgdByPincode(clean);
        if (results && results.length > 0) {
          const match = results[0];
          setPincode(clean);

          setSelectedStateCode(match.stateCode);
          setStateName(match.stateName);

          const dists = await getLgdDistrictsByState(match.stateCode);
          setLgdDistricts(dists);
          if (match.districtCode) {
            setSelectedDistrictCode(match.districtCode);
            setCityName(match.districtName || '');

            const subs = await getLgdSubdistrictsByDistrict(match.districtCode);
            setLgdSubdistricts(subs);
            if (match.subdistrictCode) {
              setSelectedSubdistrictCode(match.subdistrictCode);
              setSubdistrictName(match.subdistrictName || '');
            } else if (subs.length > 0) {
              setSelectedSubdistrictCode(subs[0].subdistrict_code);
              setSubdistrictName(subs[0].subdistrict_name);
            }
          }

          if (match.localBodyName) {
            setAreaName(match.localBodyName);
            setSelectedLocalBodyCode(match.localBodyCode || null);
          }

          setPincodeSuccessNote(`Verified: ${match.localBodyName || match.districtName}, ${match.stateName}`);
        } else {
          setPincode(clean);
          setPincodeSuccessNote(`PIN ${clean} registered. Location can also be adjusted via dropdowns.`);
        }
      } catch (err) {
        console.error('PIN lookup failed:', err);
      } finally {
        setIsSearchingPincode(false);
      }
    } else {
      setPincodeSuccessNote(null);
    }
  };

  // Fetch real categories from Supabase on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('status', 'ACTIVE')
          .order('display_order', { ascending: true });

        if (!error && data && Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setSelectedCategory(data[0].slug || data[0].id);
        }
      } catch (err) {
        console.warn('Using default categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Format file size helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Inspect video dimensions and aspect ratio to auto-suggest or set format (9:16 short vs 16:9 long)
  const inspectVideoFile = async (file: File): Promise<VideoAnalysisResult | null> => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;

        video.onloadedmetadata = () => {
          const width = video.videoWidth || 0;
          const height = video.videoHeight || 0;
          const duration = video.duration || 0;
          URL.revokeObjectURL(objectUrl);

          if (width > 0 && height > 0) {
            const aspectRatio = width / height;
            // Vertical / Portrait (9:16, 4:5, 3:4) is ratio < 0.95
            const isVertical = aspectRatio < 0.95;
            const suggestedFormat: 'SHORT_VIDEO' | 'LONG_VIDEO' = isVertical ? 'SHORT_VIDEO' : 'LONG_VIDEO';
            const ratioLabel = isVertical ? '9:16 Vertical (Reel / Byte)' : '16:9 Landscape (Widescreen)';
            const resolutionLabel = `${width} × ${height}px`;
            
            const mins = Math.floor(duration / 60);
            const secs = Math.floor(duration % 60);
            const durationFormatted = duration > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : '';

            resolve({
              width,
              height,
              duration,
              aspectRatio,
              suggestedFormat,
              ratioLabel,
              resolutionLabel,
              durationFormatted
            });
          } else {
            resolve(null);
          }
        };

        video.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
      } catch (_) {
        resolve(null);
      }
    });
  };

  // Generate video thumbnail frame using offscreen video and canvas
  const generateVideoThumbnail = async (file: File): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;

        video.onloadeddata = () => {
          video.currentTime = Math.min(1.5, (video.duration || 1) / 2);
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 720;
            canvas.height = video.videoHeight || 1280;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              canvas.toBlob((blob) => {
                URL.revokeObjectURL(objectUrl);
                resolve(blob);
              }, 'image/jpeg', 0.85);
            } else {
              URL.revokeObjectURL(objectUrl);
              resolve(null);
            }
          } catch (_) {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
          }
        };

        video.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
      } catch (_) {
        resolve(null);
      }
    });
  };

  // Cancel any active media upload
  const handleCancelUpload = () => {
    if (uploadAbortControllerRef.current) {
      uploadAbortControllerRef.current.abort();
      uploadAbortControllerRef.current = null;
    }
    setUploadingMedia(false);
    setUploadPercent(0);
    setUploadProgressMsg('');
  };

  // Upload file supporting up to 2 GB with progress tracking and instant cancellation
  const uploadFileToR2 = async (file: File, folder: string) => {
    setSubmitError(null);
    const isVideo = contentFormat !== 'ARTICLE' || file.type.includes('video');

    // Auto-analyze video dimensions and aspect ratio to auto-suggest or set format
    if (file.type.includes('video')) {
      inspectVideoFile(file).then((analysis) => {
        if (analysis) {
          setDetectedVideoMeta(analysis);
          setContentFormat(analysis.suggestedFormat);
        }
      });
    }

    // Maximum file size check: 2 GB (2048 MB)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
    if (file.size > MAX_SIZE_BYTES) {
      setSubmitError(`File size (${formatBytes(file.size)}) exceeds the maximum allowed 2 GB limit. Please select a file under 2 GB.`);
      return;
    }

    // Cancel any existing in-flight upload before starting a new one
    if (uploadAbortControllerRef.current) {
      uploadAbortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    uploadAbortControllerRef.current = abortController;

    setUploadingMedia(true);
    setUploadPercent(0);
    setUploadProgressMsg(`Preparing ${file.name}...`);
    setMediaFileSize(formatBytes(file.size));

    // Auto-extract thumbnail frame if video
    if (isVideo && file.type.includes('video') && !thumbnailUrl) {
      generateVideoThumbnail(file).then(async (thumbBlob) => {
        if (thumbBlob && !abortController.signal.aborted) {
          try {
            const thumbFile = new File([thumbBlob], `thumb_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const thumbRes = await uploadToR2Storage(thumbFile, 'thumbnails');
            if (thumbRes?.publicUrl && !abortController.signal.aborted) {
              setThumbnailUrl(thumbRes.publicUrl);
            }
          } catch (e) {
            console.warn('Auto-thumbnail upload notice:', e);
          }
        }
      });
    }

    try {
      const targetFolder = (folder || (isVideo ? 'videos' : 'thumbnails')) as any;
      const res = await uploadToR2Storage(
        file,
        targetFolder,
        (percent) => {
          setUploadPercent(percent);
          setUploadProgressMsg(`Uploading media (${percent}%)...`);
        },
        abortController.signal
      );

      if (abortController.signal.aborted) return;

      if (folder === 'thumbnails' || (!file.type.includes('video') && folder !== 'videos')) {
        setThumbnailUrl(res.publicUrl);
        if (!mediaUrl && contentFormat === 'ARTICLE') {
          setMediaUrl(res.publicUrl);
          setMediaFileName(file.name);
        }
      } else {
        setMediaUrl(res.publicUrl);
        setMediaFileName(file.name);
      }

      setUploadPercent(100);
      setUploadProgressMsg('Media uploaded successfully!');
      setTimeout(() => setUploadProgressMsg(''), 2500);
    } catch (err: any) {
      if (err?.name === 'AbortError' || abortController.signal.aborted) {
        setUploadProgressMsg('');
        setUploadPercent(0);
        setMediaFileSize('');
        return;
      }
      console.error('Media upload failed:', err);
      setSubmitError(err.message || 'Failed to upload media. Please try again.');
      setUploadProgressMsg('');
    } finally {
      if (uploadAbortControllerRef.current === abortController) {
        setUploadingMedia(false);
        uploadAbortControllerRef.current = null;
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, folder: string) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFileToR2(file, folder);
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>, folder: string) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFileToR2(file, folder);
    }
  };

  const handleValidateStep = (step: 1 | 2): boolean => {
    setSubmitError(null);
    if (step === 1) {
      if ((contentFormat === 'SHORT_VIDEO' || contentFormat === 'LONG_VIDEO') && !mediaUrl) {
        setSubmitError(`Please attach or upload a video file for this ${contentFormat === 'SHORT_VIDEO' ? 'Short Byte (9:16)' : 'Long Ground Video (16:9)'}.`);
        return false;
      }
      if (contentFormat === 'ARTICLE' && !mediaUrl && !thumbnailUrl) {
        setSubmitError('Please attach photographic evidence for the article.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!title.trim() || title.trim().length < 5) {
        setSubmitError('Please enter an editorial headline (minimum 5 characters).');
        return false;
      }
      if (!description.trim() || description.trim().length < 10) {
        setSubmitError('Please provide a ground report description (minimum 10 characters).');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleSubmitContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token) return;
    setSubmitError(null);
    setSubmitSuccessMsg(null);

    if (!title.trim()) {
      setSubmitError('Please enter a headline before publishing.');
      setCurrentStep(2);
      return;
    }
    if (!description.trim()) {
      setSubmitError('Please describe what occurred in the ground report.');
      setCurrentStep(2);
      return;
    }
    if (!mediaUrl && contentFormat !== 'ARTICLE') {
      setSubmitError('Please upload your video file before publishing.');
      setCurrentStep(1);
      return;
    }

    setSubmittingContent(true);
    try {
      const isVideo = contentFormat !== 'ARTICLE';
      const { data: authData } = await supabase.auth.getUser();
      let creatorId = typeof window !== 'undefined' ? localStorage.getItem('creator_id') : null;
      if (authData.user?.id) {
        let { data: creatorRow } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (!creatorRow) {
          const { data: newCreator } = await supabase
            .from('creators')
            .insert({
              user_id: authData.user.id,
              channel_name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Citizen Reporter',
              verification_status: 'APPROVED'
            })
            .select('id')
            .maybeSingle();
          creatorRow = newCreator;
        }

        if (creatorRow?.id) {
          creatorId = creatorRow.id;
        }
      }

      // Resolve valid category UUID
      const targetCategoryObj = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory);
      const validCategoryId = targetCategoryObj?.id || (categories.length > 0 ? categories[0].id : null);

      if (!mediaUrl) {
        setSubmitError('Please select and upload your video or photo ground report evidence before submitting.');
        setSubmittingContent(false);
        return;
      }

      const finalMediaUrl = mediaUrl;
      const finalThumbUrl = thumbnailUrl || finalMediaUrl;

      const { data, error } = await supabase
        .from('contents')
        .insert({
          creator_id: creatorId,
          type: isVideo ? 'VIDEO' : 'ARTICLE',
          title: title.trim(),
          description: description.trim(),
          media_url: finalMediaUrl,
          thumbnail_url: finalThumbUrl,
          category_id: validCategoryId,
          location: {
            country: 'India',
            state: stateName,
            district: cityName,
            subdistrict: subdistrictName,
            village: areaName,
            city: cityName,
            area: areaName,
            pincode: pincode
          },
          location_country: 'India',
          location_state: stateName,
          location_district: cityName,
          location_subdistrict: subdistrictName,
          location_village: areaName,
          location_city: cityName,
          location_area: areaName,
          location_pincode: pincode,
          state_code: selectedStateCode || null,
          district_code: selectedDistrictCode || null,
          subdistrict_code: selectedSubdistrictCode || null,
          local_body_code: selectedLocalBodyCode || null,
          moderation_status: 'PENDING_REVIEW',
          publication_status: 'DRAFT',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase content insert error:', error);
        throw new Error(error.message || 'Failed to submit report');
      }

      setSubmitSuccessMsg('Ground report published and sent to editorial verification! Redirecting to Content Library...');
      await fetchDashboard();
      await fetchContents();
      setTimeout(() => {
        setActiveTabNav('files');
      }, 1200);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit content. Please check required fields.');
    } finally {
      setSubmittingContent(false);
    }
  };

  const previewLocation = `${areaName ? areaName + ' • ' : ''}${subdistrictName ? subdistrictName + ', ' : ''}${cityName}, ${stateName}${pincode ? ' (PIN ' + pincode + ')' : ''}`;
  const selectedCategoryObj = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Studio Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#DE5227] dark:text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-[#DE5227]/20">
              STUDIO WORKFLOW
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              $1.00 CPM Guaranteed Rate (~₹{rate.toFixed(2)}/1k reads)
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-[#F2ECE1] dark:bg-slate-800 px-2 py-0.5 rounded">
              Max 2 GB File
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Publish Ground Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Publish Short Bytes (9:16) or Long In-Depth Investigations (16:9) with pinpoint 5km geofencing across all Indian states.
          </p>
        </div>

      </div>

      {/* Notifications */}
      {submitSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{submitSuccessMsg}</span>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="font-semibold">{submitError}</span>
        </div>
      )}

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GUIDED 3-STEP PUBLISHING WIZARD (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* STEP PROGRESS BAR */}
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-4 rounded-3xl shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
            <div className="flex items-center justify-between gap-2">
              {[
                { step: 1, label: 'Media Evidence', desc: 'Short / Long Video' },
                { step: 2, label: 'Story Core', desc: 'Headline & Narrative' },
                { step: 3, label: 'Geofence Beat', desc: 'All States & Wards' }
              ].map((item) => {
                const isCurrent = currentStep === item.step;
                const isPassed = currentStep > item.step;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => {
                      if (item.step < currentStep || handleValidateStep(1)) {
                        setCurrentStep(item.step as any);
                      }
                    }}
                    className={`flex-1 flex items-center gap-2.5 text-left transition rounded-2xl p-2.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-orange-500/10 border border-[#DE5227]/30 text-[#DE5227] dark:text-orange-400'
                        : isPassed
                        ? 'text-emerald-700 dark:text-emerald-400 hover:bg-[#F2ECE1] dark:hover:bg-slate-800/40'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 font-mono transition-colors ${
                        isCurrent
                          ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/20'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : item.step}
                    </div>
                    <div className="hidden sm:block overflow-hidden">
                      <div className="text-xs font-bold truncate leading-tight">{item.label}</div>
                      <div className="text-[10px] opacity-75 truncate font-mono">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: MEDIA EVIDENCE (2 VIDEO FORMATS + 2GB HERO DROPZONE) */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] animate-in fade-in duration-150">
              
              {/* 2 VIDEO FORMAT SWITCHER */}
              <div className="space-y-2 pb-3 border-b border-stone-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black font-serif text-slate-900 dark:text-white">Choose Video / Content Format</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Select Short Video (9:16 Reel) or Long Video (16:9 In-Depth).</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-orange-500/10 text-[#DE5227] dark:text-orange-400 px-2 py-0.5 rounded-full border border-[#DE5227]/20">
                    2 GB MAX FILE
                  </span>
                </div>

                {/* 3 Option Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  
                  {/* Format 1: Short Video */}
                  <button
                    type="button"
                    onClick={() => setContentFormat('SHORT_VIDEO')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                      contentFormat === 'SHORT_VIDEO'
                        ? 'bg-orange-500/10 border-[#DE5227]/50 text-[#DE5227] dark:text-orange-400 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-stone-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${contentFormat === 'SHORT_VIDEO' ? 'bg-[#DE5227] text-white' : 'bg-stone-200 dark:bg-slate-800 text-slate-600'}`}>
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        9:16 REEL
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Short Video Byte</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Mobile vertical byte (30s–90s) for rapid citizen updates
                      </div>
                    </div>
                  </button>

                  {/* Format 2: Long Video */}
                  <button
                    type="button"
                    onClick={() => setContentFormat('LONG_VIDEO')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                      contentFormat === 'LONG_VIDEO'
                        ? 'bg-orange-500/10 border-[#DE5227]/50 text-[#DE5227] dark:text-orange-400 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-stone-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${contentFormat === 'LONG_VIDEO' ? 'bg-[#DE5227] text-white' : 'bg-stone-200 dark:bg-slate-800 text-slate-600'}`}>
                        <Film className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        16:9 LANDSCAPE
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Long Ground Video</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        In-depth investigative documentary, sting, or townhall
                      </div>
                    </div>
                  </button>

                  {/* Format 3: Photo Article */}
                  <button
                    type="button"
                    onClick={() => setContentFormat('ARTICLE')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                      contentFormat === 'ARTICLE'
                        ? 'bg-orange-500/10 border-[#DE5227]/50 text-[#DE5227] dark:text-orange-400 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-stone-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${contentFormat === 'ARTICLE' ? 'bg-[#DE5227] text-white' : 'bg-stone-200 dark:bg-slate-800 text-slate-600'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        PHOTO & TEXT
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Ground Article</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Written investigation with high-res photo evidence
                      </div>
                    </div>
                  </button>
                </div>

                {/* Smart Aspect Ratio Auto-Detection & Format Suggestion Card */}
                {detectedVideoMeta && (
                  <div className="mt-3 p-3.5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-slate-900/40 border border-orange-300/80 dark:border-orange-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in zoom-in-98 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#DE5227] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">Smart Aspect Ratio Detected</span>
                          <span className="font-mono text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-stone-200 dark:border-slate-800 font-bold text-[#DE5227] dark:text-orange-400">
                            {detectedVideoMeta.resolutionLabel} • {detectedVideoMeta.ratioLabel} {detectedVideoMeta.durationFormatted ? `(${detectedVideoMeta.durationFormatted})` : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Format auto-configured as <strong className="text-[#DE5227] dark:text-orange-400 font-bold">{contentFormat === 'SHORT_VIDEO' ? 'Short Video Byte (9:16 Reel)' : 'Long Ground Video (16:9 Widescreen)'}</strong> for maximum citizen reach.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setContentFormat(contentFormat === 'SHORT_VIDEO' ? 'LONG_VIDEO' : 'SHORT_VIDEO')}
                        className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Sliders className="w-3 h-3 text-[#DE5227]" />
                        <span>Switch to {contentFormat === 'SHORT_VIDEO' ? '16:9 Landscape' : '9:16 Reel'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drag-and-Drop Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => handleDropFile(e, contentFormat === 'ARTICLE' ? 'images' : 'videos')}
                className={`p-7 border-2 border-dashed rounded-3xl text-center space-y-4 transition ${
                  isDragging
                    ? 'border-[#DE5227] bg-orange-500/10'
                    : 'border-stone-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 hover:border-[#DE5227]/50'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-[#DE5227] dark:text-orange-400 border border-[#DE5227]/20 flex items-center justify-center mx-auto shadow-2xs">
                  {contentFormat === 'SHORT_VIDEO' ? (
                    <Smartphone className="w-7 h-7" />
                  ) : contentFormat === 'LONG_VIDEO' ? (
                    <Film className="w-7 h-7" />
                  ) : (
                    <ImageIcon className="w-7 h-7" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-black font-serif text-slate-900 dark:text-white">
                    {mediaFileName ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{mediaFileName}</span>
                      </span>
                    ) : (
                      <span>
                        Drop your {contentFormat === 'SHORT_VIDEO' ? 'Short Byte (9:16)' : contentFormat === 'LONG_VIDEO' ? 'Long Investigation Video (16:9)' : 'Photo Evidence'} here
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {contentFormat !== 'ARTICLE'
                      ? 'Supports MP4, MOV, WebM, MKV • Maximum File Size: 2 GB • Fast & Secure CDN Delivery'
                      : 'Supports high-res JPG, PNG, WebM shots • Maximum 50 MB'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DE5227] hover:bg-[#C84318] active:scale-98 text-white text-xs font-bold cursor-pointer transition shadow-md shadow-orange-500/20">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse File (Max 2 GB)</span>
                    <input
                      type="file"
                      accept={contentFormat !== 'ARTICLE' ? 'video/*' : 'image/*'}
                      onChange={e => handleFileInputChange(e, contentFormat !== 'ARTICLE' ? 'videos' : 'images')}
                      className="hidden"
                    />
                  </label>

                  {/* Thumbnail button for videos */}
                  {contentFormat !== 'ARTICLE' && (
                    <label className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-stone-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-[#F2ECE1] dark:hover:bg-slate-800 transition">
                      <Camera className="w-3.5 h-3.5 text-slate-400" />
                      <span>{thumbnailUrl ? 'Change Thumbnail' : 'Add Custom Thumbnail'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileInputChange(e, 'thumbnails')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Professional Upload Progress Card with Cancel Button */}
                {uploadingMedia && (
                  <div className="pt-3 max-w-lg mx-auto animate-in fade-in zoom-in-98 duration-200 text-left">
                    <div className="p-4 bg-stone-50 dark:bg-slate-900/90 rounded-2xl border border-stone-200/90 dark:border-slate-800 shadow-sm space-y-3">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DE5227] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DE5227]" />
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {uploadProgressMsg || 'Uploading media...'}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-black text-[#DE5227] dark:text-orange-400 shrink-0">
                          {uploadPercent}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-stone-200/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-stone-300/60 dark:border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-[#DE5227] via-orange-500 to-amber-500 rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${uploadPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono text-[11px]">
                          {mediaFileSize ? `${mediaFileSize} • High-speed Upload` : 'Secure upload in progress'}
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelUpload}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer font-bold text-[11px] shadow-2xs"
                          title="Cancel upload"
                        >
                          <X className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant Player Preview */}
              {mediaUrl && (
                <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-stone-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-400 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>
                        {contentFormat === 'SHORT_VIDEO'
                          ? 'Vertical 9:16 Reel Player'
                          : contentFormat === 'LONG_VIDEO'
                          ? 'Widescreen 16:9 Investigation Player'
                          : 'Photo Evidence Preview'}
                      </span>
                    </span>
                    {mediaFileSize && (
                      <span className="text-slate-500 text-[11px] font-mono font-bold">{mediaFileSize} / 2 GB</span>
                    )}
                  </div>

                  {contentFormat === 'SHORT_VIDEO' ? (
                    <div className="relative max-w-xs mx-auto rounded-2xl overflow-hidden bg-black aspect-[9/16] flex items-center justify-center shadow-lg border border-stone-300 dark:border-slate-700">
                      <video
                        src={mediaUrl}
                        controls
                        poster={thumbnailUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : contentFormat === 'LONG_VIDEO' ? (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-lg border border-stone-300 dark:border-slate-700">
                      <video
                        src={mediaUrl}
                        controls
                        poster={thumbnailUrl}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-black max-h-72 flex items-center justify-center shadow-lg">
                      <img
                        src={mediaUrl}
                        alt="Evidence shot"
                        className="w-full h-full object-cover max-h-72"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Media Storage: Verified & Synced</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaUrl('');
                        setMediaFileName('');
                        setThumbnailUrl('');
                      }}
                      className="text-red-500 hover:underline cursor-pointer font-bold"
                    >
                      Remove Media
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1 Actions */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (handleValidateStep(1)) {
                      setCurrentStep(2);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <span>Continue to Story Core</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: STORY CORE (HEADLINE & REPORT NARRATIVE) */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] animate-in fade-in duration-150">
              <div className="pb-3 border-b border-stone-200/60 dark:border-slate-800">
                <h3 className="text-sm font-black font-serif text-slate-900 dark:text-white">Editorial Headline & Ground Narrative</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Ground news reports must be concise, factual, and specify location immediately.</p>
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">
                    Story Headline / Title <span className="text-[#DE5227]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {title.length}/120 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Ward 14 Main Drain Overflow Stalls Daily Clinic Access"
                  maxLength={120}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/80 border border-stone-200/90 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25 font-bold"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Tip: Include the locality, issue, and affected citizens for higher ward readership.
                </p>
              </div>

              {/* Narrative Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">
                    Ground Investigation Report <span className="text-[#DE5227]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {description.length} chars (min 10)
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail what occurred on the ground: Who was affected? How long has this civic issue persisted? What is the municipal response so far?"
                  rows={6}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/80 border border-stone-200/90 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25 font-medium leading-relaxed resize-none"
                />
              </div>

              {/* Step 2 Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-[#F2ECE1] dark:hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Media</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (handleValidateStep(2)) {
                      setCurrentStep(3);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <span>Continue to Geofence Beat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HYPERLOCAL GEOFENCE BEAT */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] animate-in fade-in duration-150">
              <div className="pb-3 border-b border-stone-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black font-serif text-slate-900 dark:text-white">Hyperlocal Geofence & Civic Category</h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    OFFICIAL LGD HIERARCHY
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Pinpoint your report through the official Local Government Directory: State → District → Sub-District → Village/Ward.
                </p>
              </div>

              {/* Pinpoint Location Beat Grid */}
              <div className="space-y-4">
                {/* 1. SMART PIN CODE QUICK-RESOLVER */}
                <div className="p-3.5 bg-[#F8F5EE] dark:bg-slate-900/60 border border-[#DCD1BF]/80 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <Sparkles className="w-3.5 h-3.5 text-[#DE5227]" />
                      <span>Instant 6-Digit Postal PIN Auto-Fill</span>
                    </div>
                    {isSearchingPincode && (
                      <span className="text-[10px] font-mono text-[#DE5227] flex items-center gap-1 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Resolving LGD...
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        value={pincodeInput}
                        onChange={e => handlePincodeSearch(e.target.value)}
                        placeholder="Type 6-digit postal code (e.g. 800001, 221001, 560001)..."
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25"
                      />
                    </div>
                  </div>

                  {pincodeSuccessNote && (
                    <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{pincodeSuccessNote}</span>
                    </div>
                  )}
                </div>

                {/* 2. CASCADING 4-LEVEL HIERARCHY SELECTOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Level 1: State / UT */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>1. State / UT</span>
                      <span className="text-[9px] font-mono font-normal text-slate-400">({lgdStates.length})</span>
                    </label>
                    <select
                      value={selectedStateCode || ''}
                      onChange={e => handleLgdStateChange(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25"
                    >
                      {lgdStates.map(s => (
                        <option key={s.state_code} value={s.state_code}>
                          {s.state_name} ({s.state_or_ut === 'UT' ? 'UT' : 'State'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level 2: District */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>2. District</span>
                      <span className="text-[9px] font-mono font-normal text-slate-400">
                        {loadingDistricts ? 'Loading...' : `(${lgdDistricts.length})`}
                      </span>
                    </label>
                    <select
                      value={selectedDistrictCode || ''}
                      onChange={e => handleLgdDistrictChange(Number(e.target.value))}
                      disabled={loadingDistricts || lgdDistricts.length === 0}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25 disabled:opacity-60"
                    >
                      {lgdDistricts.map(d => (
                        <option key={d.district_code} value={d.district_code}>
                          {d.district_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level 3: Sub-District / Tehsil */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>3. Sub-District / Tehsil</span>
                      <span className="text-[9px] font-mono font-normal text-slate-400">
                        {loadingSubdistricts ? 'Loading...' : `(${lgdSubdistricts.length})`}
                      </span>
                    </label>
                    <select
                      value={selectedSubdistrictCode || ''}
                      onChange={e => handleLgdSubdistrictChange(Number(e.target.value))}
                      disabled={loadingSubdistricts || lgdSubdistricts.length === 0}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25 disabled:opacity-60"
                    >
                      {lgdSubdistricts.map(sd => (
                        <option key={sd.subdistrict_code} value={sd.subdistrict_code}>
                          {sd.subdistrict_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level 4: Village / Local Body / Ward */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>4. Village / Ward / PIN *</span>
                      <span className="text-[9px] font-mono font-normal text-[#DE5227]">{pincode ? `PIN: ${pincode}` : ''}</span>
                    </label>
                    <input
                      type="text"
                      list="lgdLocalBodiesDatalist"
                      value={areaName}
                      onChange={e => setAreaName(e.target.value)}
                      placeholder="e.g. Kankarbagh Ward 14 or Village"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25"
                      required
                    />
                    <datalist id="lgdLocalBodiesDatalist">
                      {lgdLocalBodies.map(lb => (
                        <option key={lb.id} value={lb.local_body_name}>
                          {lb.local_body_name} ({lb.local_body_type || 'Local Body'}) - PIN {lb.pincode}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Recognized Local Bodies Chips */}
                {lgdLocalBodies.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Recognized Local Bodies in {cityName} (Click to select):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {lgdLocalBodies.slice(0, 10).map(lb => (
                        <button
                          key={lb.id}
                          type="button"
                          onClick={() => {
                            setAreaName(lb.local_body_name);
                            setPincode(lb.pincode);
                            setSelectedLocalBodyCode(lb.local_body_code);
                            if (lb.subdistrict_code) {
                              setSelectedSubdistrictCode(lb.subdistrict_code);
                              const matched = lgdSubdistricts.find(s => s.subdistrict_code === lb.subdistrict_code);
                              if (matched) setSubdistrictName(matched.subdistrict_name);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                            areaName === lb.local_body_name
                              ? 'bg-[#DE5227] text-white font-bold shadow-xs'
                              : 'bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#DE5227]/40'
                          }`}
                        >
                          <span>{lb.local_body_name}</span>
                          <span className="text-[9px] opacity-75 font-mono">({lb.pincode})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Geofence Target Summary Banner */}
                <div className="p-3.5 bg-orange-500/5 dark:bg-orange-500/10 border border-[#DE5227]/20 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#DE5227] dark:text-orange-400 font-bold min-w-0">
                    <Radio className="w-4 h-4 text-[#DE5227] animate-pulse shrink-0" />
                    <span className="shrink-0">Geofence Target:</span>
                    <span className="font-mono text-slate-900 dark:text-white truncate">{previewLocation}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#DE5227] dark:text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-full shrink-0">
                    5KM RADIUS PUSH
                  </span>
                </div>
              </div>

              {/* Compact Category Chips Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Layers className="w-4 h-4 text-[#DE5227]" />
                  <span>Select Civic Category</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => {
                    const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.slug || cat.id)}
                        className={`p-2.5 rounded-2xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-orange-500/10 border-[#DE5227]/50 text-[#DE5227] dark:text-orange-400 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-900/60 border-stone-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate font-bold leading-tight">{formatEnglishCategory(cat.name)}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#DE5227] shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 Actions & Publish CTA */}
              <div className="pt-3 border-t border-stone-200/60 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-[#F2ECE1] dark:hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Headline</span>
                  </button>

                  <button
                    type="button"
                    disabled={submittingContent || uploadingMedia}
                    onClick={() => handleSubmitContent()}
                    className="px-7 py-3 bg-[#DE5227] hover:bg-[#C84318] active:scale-98 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submittingContent ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Publishing Ground Report...</span>
                      </span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Publish Ground Report</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-stone-100/70 dark:bg-slate-900/40 rounded-2xl border border-stone-200/60 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    By publishing, you certify this ground evidence is authentic, filmed on location, and compliant with the <strong>Nagrik Ethical Journalism Charter</strong>.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE MOBILE CARD PREVIEW (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#DE5227]" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Live Mobile Card Preview
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                {contentFormat === 'SHORT_VIDEO' ? '9:16 REEL' : contentFormat === 'LONG_VIDEO' ? '16:9 VIDEO' : 'ARTICLE'}
              </span>
            </div>

            {/* Simulated Mobile Feed Card */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3 space-y-3 shadow-sm">
              
              {/* Card Media Screen */}
              <div
                className={`relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center group ${
                  contentFormat === 'SHORT_VIDEO' ? 'aspect-[9/16] max-h-96 mx-auto' : 'aspect-[16/10]'
                }`}
              >
                {mediaUrl ? (
                  contentFormat !== 'ARTICLE' ? (
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                      poster={thumbnailUrl}
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="text-center p-4 space-y-2 text-slate-500">
                    {contentFormat === 'SHORT_VIDEO' ? (
                      <Smartphone className="w-8 h-8 mx-auto opacity-50 text-slate-400" />
                    ) : contentFormat === 'LONG_VIDEO' ? (
                      <Film className="w-8 h-8 mx-auto opacity-50 text-slate-400" />
                    ) : (
                      <ImageIcon className="w-8 h-8 mx-auto opacity-50 text-slate-400" />
                    )}
                    <span className="text-[11px] font-mono block">Attach media file to preview</span>
                  </div>
                )}

                {/* Floating Category Chip */}
                <div className="absolute top-2.5 left-2.5 bg-[#DE5227] text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                  {formatEnglishCategory(selectedCategoryObj?.name || 'Civic Issues')}
                </div>

                {/* Floating Format Indicator */}
                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  {contentFormat === 'SHORT_VIDEO' ? (
                    <>
                      <Smartphone className="w-3 h-3 text-orange-400" />
                      <span>SHORT</span>
                    </>
                  ) : contentFormat === 'LONG_VIDEO' ? (
                    <>
                      <Play className="w-3 h-3 fill-white" />
                      <span>16:9 VIDEO</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3" />
                      <span>ARTICLE</span>
                    </>
                  )}
                </div>

                {/* Verified Geofence Stamp */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/90 bg-gradient-to-t from-black/80 to-transparent p-1 rounded">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#DE5227]" />
                    <span className="truncate">{areaName || 'Kankarbagh Ward 14'}</span>
                  </span>
                  <span className="text-emerald-400 font-bold">$1.00 CPM (~₹{Math.round(rate)})</span>
                </div>
              </div>

              {/* Story Content Meta */}
              <div className="space-y-1.5 px-1">
                <div className="text-xs font-serif font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {title || 'Headline will appear here as you type in Step 2...'}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                  {description || 'Investigation narrative preview... Describe the civic issue, affected ward residents, and municipal response.'}
                </p>
              </div>

              {/* Card Reporter Footer */}
              <div className="pt-2 border-t border-stone-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#DE5227] text-white font-bold text-[10px] flex items-center justify-center">
                    C
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight">
                      Citizen Reporter
                    </div>
                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">
                      Verified Stringer
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span>Just now</span>
                </div>
              </div>
            </div>

            {/* Publishing Guarantee Note */}
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/50 rounded-2xl border border-stone-200/60 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Hyperlocal 5km Ward Notification</span>
              </div>
              <p className="leading-relaxed">
                Once approved, this ground report is pushed directly to mobile citizens in <strong>{areaName}, {cityName}, {stateName}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
