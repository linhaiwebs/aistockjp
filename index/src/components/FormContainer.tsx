import { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="w-[95%] mx-auto">
      <div
        className="bg-transparent rounded-t-[32px] px-5 py-2"
        style={{
          minHeight: '40vh'
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              早速始めましょう
            </h2>
            <p className="text-sm text-gray-300 text-center">
              銘柄コードまたは銘柄名を入力してください
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
