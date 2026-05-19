import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Separator } from "../components/ui/separator";
import { Check, CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function OrderForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    existingWebsite: "",
    city: "",
    selectedPackage: "bisnis",
    selectedTemplate: "restoran",
    addons: [] as string[],
    kickoffDate: undefined as Date | undefined,
    description: "",
    agreedToTerms: false
  });

  const steps = [
    { number: 1, title: "Info Bisnis" },
    { number: 2, title: "Paket & Template" },
    { number: 3, title: "Jadwal & Preferensi" },
    { number: 4, title: "Review & Konfirmasi" }
  ];

  const packages = [
    { value: "starter", label: "Starter - Rp 1.500.000", price: 1500000 },
    { value: "bisnis", label: "Bisnis - Rp 2.500.000", price: 2500000 },
    { value: "kustom", label: "Kustom - Hubungi Sales", price: 0 }
  ];

  const templates = [
    { value: "restoran", label: "Template Restoran", image: "🍽️" },
    { value: "toko", label: "Template Toko", image: "🏪" },
    { value: "klinik", label: "Template Klinik", image: "🏥" },
    { value: "properti", label: "Template Properti", image: "🏠" }
  ];

  const addons = [
    { value: "logo", label: "Desain Logo", price: 500000 },
    { value: "domain", label: "Domain Premium", price: 300000 },
    { value: "content", label: "Penulisan Konten", price: 750000 },
    { value: "seo", label: "SEO Premium", price: 1000000 }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const calculateTotal = () => {
    const selectedPackage = packages.find(p => p.value === formData.selectedPackage);
    const packagePrice = selectedPackage?.price || 0;
    const addonsPrice = formData.addons.reduce((total, addonValue) => {
      const addon = addons.find(a => a.value === addonValue);
      return total + (addon?.price || 0);
    }, 0);
    return packagePrice + addonsPrice;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step.number < currentStep
                        ? "bg-green-600 text-white"
                        : step.number === currentStep
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      step.number <= currentStep ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 -mt-8 transition-all ${
                      step.number < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white border rounded-lg p-8">
          {/* Step 1: Info Bisnis */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Informasi Bisnis</h2>
                <p className="text-gray-600">Ceritakan tentang bisnis Anda</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Nama Bisnis *</Label>
                  <Input
                    id="businessName"
                    placeholder="Contoh: Kafe Nusantara"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Jenis Usaha *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis usaha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restoran">Restoran/Kafe</SelectItem>
                      <SelectItem value="toko">Toko/Retail</SelectItem>
                      <SelectItem value="klinik">Klinik/Kesehatan</SelectItem>
                      <SelectItem value="properti">Properti</SelectItem>
                      <SelectItem value="jasa">Jasa</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="existingWebsite">Website Lama (Opsional)</Label>
                  <Input
                    id="existingWebsite"
                    placeholder="https://website-lama.com"
                    value={formData.existingWebsite}
                    onChange={(e) => setFormData({ ...formData, existingWebsite: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jika Anda sudah punya website sebelumnya
                  </p>
                </div>

                <div>
                  <Label htmlFor="city">Kota *</Label>
                  <Input
                    id="city"
                    placeholder="Contoh: Jakarta"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Paket & Template */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Pilih Paket & Template</h2>
                <p className="text-gray-600">Sesuaikan dengan kebutuhan Anda</p>
              </div>

              <div>
                <Label>Paket *</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.value}
                      onClick={() => setFormData({ ...formData, selectedPackage: pkg.value })}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.selectedPackage === pkg.value
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{pkg.label}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.selectedPackage === pkg.value
                              ? "border-black bg-black"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.selectedPackage === pkg.value && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Template</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {templates.map((template) => (
                    <div
                      key={template.value}
                      onClick={() => setFormData({ ...formData, selectedTemplate: template.value })}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${
                        formData.selectedTemplate === template.value
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-4xl mb-2">{template.image}</div>
                      <p className="text-sm font-medium">{template.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Add-ons (Opsional)</Label>
                <div className="space-y-3 mt-2">
                  {addons.map((addon) => (
                    <div key={addon.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={addon.value}
                        checked={formData.addons.includes(addon.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              addons: [...formData.addons, addon.value]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              addons: formData.addons.filter((a) => a !== addon.value)
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={addon.value}
                        className="flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <span>{addon.label}</span>
                        <span className="text-sm text-gray-500">
                          +{formatPrice(addon.price)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Jadwal & Preferensi */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Jadwal & Preferensi</h2>
                <p className="text-gray-600">Atur jadwal kick-off meeting</p>
              </div>

              <div>
                <Label>Jadwal Kick-off Call *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-2"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.kickoffDate ? (
                        format(formData.kickoffDate, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.kickoffDate}
                      onSelect={(date) => setFormData({ ...formData, kickoffDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-gray-500 mt-1">
                  Tim kami akan menghubungi untuk konfirmasi waktu
                </p>
              </div>

              <div>
                <Label htmlFor="description">Ceritakan Bisnis Anda</Label>
                <Textarea
                  id="description"
                  placeholder="Ceritakan tentang bisnis Anda, target audiens, kompetitor, atau hal lain yang ingin Anda sampaikan..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Upload Brand Kit (Opsional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop atau klik untuk upload
                  </p>
                  <p className="text-xs text-gray-400">
                    Logo, foto, atau dokumen lainnya (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Konfirmasi */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Review Pesanan</h2>
                <p className="text-gray-600">Periksa kembali detail pesanan Anda</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama Bisnis:</span>
                      <span className="font-medium">{formData.businessName || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jenis Usaha:</span>
                      <span className="font-medium">{formData.businessType || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kota:</span>
                      <span className="font-medium">{formData.city || "-"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Paket & Template</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paket:</span>
                      <span className="font-medium capitalize">{formData.selectedPackage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium capitalize">{formData.selectedTemplate}</span>
                    </div>
                    {formData.addons.length > 0 && (
                      <div>
                        <span className="text-gray-600">Add-ons:</span>
                        <ul className="mt-1 space-y-1">
                          {formData.addons.map((addonValue) => {
                            const addon = addons.find((a) => a.value === addonValue);
                            return (
                              <li key={addonValue} className="flex justify-between ml-4">
                                <span>• {addon?.label}</span>
                                <span className="font-medium">{formatPrice(addon?.price || 0)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, agreedToTerms: checked as boolean })
                  }
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  Saya setuju dengan{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    syarat dan ketentuan
                  </a>{" "}
                  yang berlaku
                </Label>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Metode Pembayaran</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Transfer Bank (BCA, Mandiri, BNI) atau pembayaran digital (OVO, GoPay, Dana)
                </p>
                <p className="text-xs text-gray-500">
                  Detail pembayaran akan dikirim ke email setelah pesanan dikonfirmasi
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              Kembali
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Lanjut →
              </Button>
            ) : (
              <Button
                disabled={!formData.agreedToTerms}
                className="bg-green-600 hover:bg-green-700"
              >
                Kirim Pesanan
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
