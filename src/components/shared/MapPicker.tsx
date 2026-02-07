'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, Loader2, X, MapPin } from 'lucide-react';

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

interface SearchResult {
  description: string;
  place_id: string;
}

export function MapPicker({ latitude, longitude, onLocationSelect, height = '400px' }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (googleMapsLoaded) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não configurada');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleMapsLoaded(true);
    };
    script.onerror = () => {
      console.error('Erro ao carregar Google Maps. Verifique se a API key está correta e se as APIs estão habilitadas.');
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [googleMapsLoaded]);

  const searchPlace = useCallback(async (query: string) => {
    if (!query.trim() || !window.google) {
      setSearchResults([]);
      setShowResults(false);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    try {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: query,
          types: ['establishment', 'geocode'],
        },
        (predictions: any[] | null, status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSearchResults(
              predictions.map((p: any) => ({
                description: p.description,
                place_id: p.place_id,
              }))
            );
            setShowResults(true);
            setSelectedIndex(-1);
          } else {
            setSearchResults([]);
            setShowResults(false);
          }
          setIsSearching(false);
        }
      );
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      setIsSearching(false);
      setSearchResults([]);
      setShowResults(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowResults(false);
    setSelectedIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim() && window.google) {
      searchTimeoutRef.current = setTimeout(() => {
        searchPlace(value);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const selectResult = async (result: SearchResult) => {
    if (!window.google || !mapInstanceRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    
    service.getDetails(
      {
        placeId: result.place_id,
        fields: ['geometry', 'formatted_address'],
      },
      (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setSearchQuery(result.description);
          setShowResults(false);
          setSelectedIndex(-1);
          onLocationSelect(lat, lng);
          
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
          } else {
            markerRef.current = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
            });
          }
          
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(16);
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || searchResults.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (searchQuery.trim()) {
          searchPlace(searchQuery);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          selectResult(searchResults[selectedIndex]);
        } else if (searchResults.length > 0) {
          selectResult(searchResults[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchPlace(searchQuery);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !googleMapsLoaded || isLoaded) return;

    const defaultCenter = latitude && longitude ? { lat: latitude, lng: longitude } : { lat: -23.5505, lng: -46.6333 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: latitude && longitude ? 15 : 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    if (latitude && longitude) {
      markerRef.current = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
      });
    }

    map.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
        });
      }

      onLocationSelect(lat, lng);
    });

    mapInstanceRef.current = map;
    setIsLoaded(true);
  }, [googleMapsLoaded, latitude, longitude]);

  useEffect(() => {
    if (!mapInstanceRef.current || !latitude || !longitude || !isLoaded) return;

    const position = { lat: latitude, lng: longitude };

    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
      });
    }

    mapInstanceRef.current.setCenter(position);
    if (mapInstanceRef.current.getZoom() < 15) {
      mapInstanceRef.current.setZoom(15);
    }
  }, [latitude, longitude, isLoaded]);

  return (
    <div className="space-y-3">
      <div className="relative z-[1000]">
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            placeholder="Pesquisar estabelecimento, endereço..."
            className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
                setSearchResults([]);
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {showResults && searchResults.length > 0 && (
          <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => selectResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors flex items-start gap-3 ${
                  selectedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900 dark:text-white flex-1">{result.description}</p>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Buscando...</span>
            </div>
          </div>
        )}

        {showResults && !isSearching && searchResults.length === 0 && searchQuery.trim() && (
          <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>

      <div className="w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 relative" style={{ height, zIndex: 1 }}>
        <div ref={mapRef} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }} />
        {(!isLoaded || !googleMapsLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 z-10">
            <p className="text-gray-500 dark:text-gray-400">Carregando mapa...</p>
          </div>
        )}
      </div>
    </div>
  );
}
