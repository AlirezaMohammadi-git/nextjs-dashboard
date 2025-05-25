'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  // returning an object of current url params:
  const searchParams = useSearchParams();
  // returning current URL without params:
  const pathName = usePathname();
  // navigating between routes programically:
  const { replace } = useRouter()
  const handleSearch = useDebouncedCallback((term: string) => {
    // Use below class to manage current URL params:
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const params = new URLSearchParams(searchParams);
    // resetting page number when search query changes
    params.set('page', "1")
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query')
    }
    // replacing current URL with new one:
    replace(`${pathName}?${params.toString()}`)
  }, 400)
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => { handleSearch(e.target.value) }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
