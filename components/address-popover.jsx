import { useState } from "react";

export default function AddressPopover({ address }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="font-mono text-14 text-gray-100 bg-gray-800/50 px-3 py-1.5 rounded-2xl w-fit hover:bg-gray-800/70 transition-colors outline-none">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 -top-12 left-1/2 -translate-x-1/2">
              <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                <div className="flex items-center gap-2">
                  <span>{address}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-gray-800 rounded-md transition-colors"
                  >
                    {copied ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span>📋</span>
                    )}
                  </button>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
