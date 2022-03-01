import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'

export default function Modal(
  { children, title, closeModal }: { children: ReactNode, title?: string, closeModal?: () => void }
) {
  return (
    <>
      <div
        className="fixed w-screen h-screen top-0 left-0 z-10 bg-gray-900 bg-opacity-70"
        onClick={closeModal}
      />
      <Transition appear show as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-20 overflow-y-auto"
          onClose={closeModal || (() => null)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-md">
                <button onClick={closeModal} className="absolute top-0 right-0 p-5">
                  <i className="fas fa-times hover:text-yellow-500" />
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-inherit"
                >
                  {title || ''}
                </Dialog.Title>
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
