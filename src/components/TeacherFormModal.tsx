"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { teacherSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

type TeacherInput = z.infer<typeof teacherSchema>;

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (teacher: TeacherInput) => void;
}

export default function TeacherFormModal({ isOpen, closeModal, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherInput>({
    resolver: zodResolver(teacherSchema),
  });

  const handleFormSubmit: SubmitHandler<TeacherInput> = (data) => {
    onSubmit(data);
    toast.success("Teacher added successfully!");
    reset();
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Add Teacher
              </Dialog.Title>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                  <input
                    {...register("name")}
                    className="w-full text-black border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-red-500">{errors.name?.message}</p>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Subject</label>
                  <input
                    {...register("subject")}
                    className="w-full text-black border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-red-500">{errors.subject?.message}</p>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Experience (years)</label>
                  <input
                    type="number"
                    {...register("experience")}
                    className="w-full text-black border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-red-500">{errors.experience?.message}</p>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full text-black border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-red-500">{errors.email?.message}</p>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
