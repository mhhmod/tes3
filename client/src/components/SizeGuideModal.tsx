import { SIZE_GUIDE } from "@/lib/constants";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category = "tshirts" }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const guide = SIZE_GUIDE[category as keyof typeof SIZE_GUIDE] || SIZE_GUIDE.tshirts;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="size-guide-modal">
      <div className="bg-grind-surface rounded-xl max-w-2xl w-full m-4 animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <h2 className="font-poppins font-semibold text-xl" data-testid="size-guide-title">
            Size Guide
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            data-testid="button-close-size-guide"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold mb-3" data-testid="size-guide-table-title">
              {guide.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="size-guide-table">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2">Size</th>
                    <th className="text-left py-2">Chest</th>
                    <th className="text-left py-2">Length</th>
                    <th className="text-left py-2">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {guide.measurements.map((measurement) => (
                    <tr key={measurement.size} className="border-b border-gray-700">
                      <td className="py-2 font-medium" data-testid={`size-${measurement.size}`}>
                        {measurement.size}
                      </td>
                      <td className="py-2" data-testid={`chest-${measurement.size}`}>
                        {measurement.chest}
                      </td>
                      <td className="py-2" data-testid={`length-${measurement.size}`}>
                        {measurement.length}
                      </td>
                      <td className="py-2" data-testid={`shoulder-${measurement.size}`}>
                        {measurement.shoulder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-grind-dark p-4 rounded-lg" data-testid="measurement-guide">
            <h4 className="font-semibold mb-2">How to Measure</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li>• <strong>Length:</strong> Measure from shoulder to bottom hem</li>
              <li>• <strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
