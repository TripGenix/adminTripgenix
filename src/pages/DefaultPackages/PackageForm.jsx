import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useNavigator from "@/hooks/use-navigator";
import packageApi from "@/api/PackageApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import uploadImage from "@/utils/uploadImage";

export default function PackageForm() {
  const { id } = useParams();
  const nav = useNavigator();

const emptyForm = {
  name: "",
  price: "",
  totalPrice:0,
  passengers: 1,
  duration: "",
  vehicle: "Economy Car",
  guide: "Standard Guide",
  destinations: [""],
  hotels: [""],
  features: "",
  imageUrl: "",
  popular: false,
};

const VEHICLE_LIMITS = {
  Economy_Car: 4,
  SUV: 8,
  Luxury_Van: 15,
};


const [form, setForm] = useState(emptyForm);
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [errors, setErrors] = useState({});
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");


const pricePerPerson = Number(form.price || 0);
const passengers = Number(form.passengers || 1);

const totalPrice =
  passengers === 1
    ? pricePerPerson
    : pricePerPerson * passengers * 0.75;

    

useEffect(() => {
  if (id) {
    setLoading(true);
    packageApi
        .getPackageById(id)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name || "",
            price: p.price || "",
            totalPrice: p.totalPrice || 0,
            duration: p.duration || "",
            vehicle: p.vehicle || "",
            guide: p.guide || "",
            features: p.features?.join(", ") || "",
            popular: p.popular || false,
            passengers: p.passengers || 1,
            imageUrl: p.imageUrl || "",
            destinations: p.destinations?.length ? p.destinations : [""],
            hotels: p.hotels?.length ? p.hotels : [""],
          });
        })
        .catch(() => toast.error("Failed to load package"))
        .finally(() => setLoading(false));
    } else {
      setForm(emptyForm);
    }
  }, [id]);

  

  const validate = () => {
      const e = {};
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.price || Number(form.price) <= 0) e.price = "Valid price required";
      if (!form.passengers || Number(form.passengers) <= 0)
        e.passengers = "Passengers required";

      const max = VEHICLE_LIMITS[form.vehicle];
      if (form.passengers > max) {
        e.passengers = `Max ${max} passengers allowed for selected vehicle`;
      }

      if (!form.duration.trim()) e.duration = "Duration is required";
      if (!form.destinations.filter(d => d.trim()).length)
        e.destinations = "At least one destination required";
      if (!form.hotels.filter(h => h.trim()).length)
        e.hotels = "At least one hotel required";
      if(!form.imageUrl && !imageFile)e.imageUrl="Package image is required";

      setErrors(e);
      return Object.keys(e).length === 0;
  };
    const updateList = (key, index, value) => {
      const list = [...form[key]];
      list[index] = value;
      setForm({ ...form, [key]: list });
    };

  const addItem = (key) => {
    setForm({ ...form, [key]: [...form[key], ""] });
  };

  const removeItem = (key, index) => {
    const list = form[key].filter((_, i) => i !== index);
    setForm({ ...form, [key]: list });
  };
  

  const handleImageUpload = async () => {
    if (!imageFile) return form.imageUrl || "";
    const url = await uploadImage(imageFile);
    return url;
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    Object.values(errors).forEach((msg) => toast.error(msg));
    return;
  }

  setSaving(true);

  try {
    
    const imageUrl = await handleImageUpload();

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      passengers: Number(form.passengers),
      duration: form.duration.trim(),
      vehicle: form.vehicle,
      guide: form.guide,
      destinations: form.destinations.filter(d => d.trim()),
      hotels: form.hotels.filter(h => h.trim()),
      features: form.features
        ? form.features.split(",").map(f => f.trim())
        : [],
      imageUrl: imageUrl || "",
      popular: form.popular || false,
    };

    if (id) {
      await packageApi.updatePackage(id, payload);
      toast.success("Package updated successfully");
      nav("/packages");
    } else {
      const res = await packageApi.createPackage(payload);
      const saved = res.data;
      setForm(prev => ({ ...prev, totalPrice: saved.totalPrice }));
      toast.success("Package added successfully.");
      setForm(emptyForm);
    }
  } catch (err) {
    console.error("Full backend error:", err.response?.data || err);
    const errorMessage =
      err.response?.data?.message ||
      JSON.stringify(err.response?.data) ||
      err.message ||
      "Save failed";
    toast.error(errorMessage);
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }



  return (   
    <div className="p-6">
      <PageBreadcrumb paths={["Default Packages", []]} />
      <div className="w-full max-w-8xl bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          {id ? "Edit Tour Package" : "Add Tour Package"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label={<span className="text-gray-900">Package name</span>} error={errors.name}>
            <input
              className="input"
              placeholder="Enter package name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label={<span className="text-gray-900">Price (per person)</span>} error={errors.price}>
              <input
                type="number"
                className="input"
                placeholder="Enter price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>

            <Field label={<span className="text-gray-900">Passengers</span>} error={errors.passengers}>
              <input
                type="number"
                min="1"
                className="input"
                value={form.passengers}
                onChange={(e) =>
                  setForm({ ...form, passengers: Number(e.target.value) })
                }
              />
            </Field>

            <Field label={<span className="text-gray-900">Total Price</span>}>
              <input
                className="input bg-gray-100"
                value={totalPrice}
                disabled
              />
            </Field>

          </div>
          <Field label={<span className="text-gray-900">Duration</span>} error={errors.duration}>
            <input 
              className="input"
              placeholder="Enter duration (e.g 5 Days/ 4 Nights)"
              value={form.duration} 
              onChange={(e) => setForm({ ...form, duration: e.target.value })} 
              /> 
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={<span className="text-gray-900">Vehicle Type</span>} error={errors.vehicle}>
              <select
                className="input"
                value={form.vehicle}
                onChange={(e) =>
                  setForm({ ...form, vehicle: e.target.value })
                }
              >
                      <option value="Economy Car">Economy Car (Max 4)</option>
                      <option value="SUV">SUV (Max 8)</option>
                      <option value="Luxury Van">Luxury Van (Max 15)</option>

              </select>
            </Field>


            <Field label={<span className="text-gray-900">Guide</span>}>
              <select
                className="input"
                placeholder="Standard / Professional / Expert"
                value={form.guide}
                onChange={(e) => setForm({ ...form, guide: e.target.value })}
              >
                <option value="Standard Guide">Standard</option>
                <option value="Professional Guide">Professional</option>
                <option value="Expert Private Guide">Expert</option>
              </select>
            </Field>
          </div>

       
       
            <Field label={<span className="text-gray-900">Destinations</span>} error={errors.destinations}>
              {form.destinations.map((d, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    className="input"
                    value={d}
                    onChange={(e) => updateList("destinations", i, e.target.value)}
                    placeholder={`Destination ${i + 1}`}
                  />
                  {form.destinations.length > 1 && (
                    <button type="button" onClick={() => removeItem("destinations", i)} className="text-red-500">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem("destinations")} className="text-blue-600 text-sm">
                + Add destination
              </button>
            </Field>

          <Field label={<span className="text-gray-900">Hotels</span>} error={errors.hotels}>
            {form.hotels.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="input"
                  value={h}
                  onChange={(e) => updateList("hotels", i, e.target.value)}
                  placeholder={`Hotel ${i + 1}`}
                />
                {form.hotels.length > 1 && (
                  <button type="button" onClick={() => removeItem("hotels", i)} className="text-red-500">
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addItem("hotels")} className="text-blue-600 text-sm">
              + Add hotel
            </button>
          </Field>

          
         <Field label={<span className="text-gray-900">Package Image</span>}error={errors.imageUrl}>
          <input
            type="file"
            className="input"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

             // setImageFile(file);
              setImagePreview(URL.createObjectURL(file)); // 👈 preview
  }}
          />
          </Field>

          {(imagePreview || form.imageUrl) && (
            <div className="mt-3 relative w-64">
              <img
                src={imagePreview || form.imageUrl}
                alt="Package preview"
                className="w-50 h-40 object-cover rounded-lg border"
              />

            </div>
          )}



          <Field label={<span className="text-gray-900">Description</span>}>
            <textarea
              rows="2"
              className="input"
              placeholder="Add package description here..."
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </Field>

          <Field>
            <div className="flex items-center gap-2">
              <input
                id="popular"
                type="checkbox"
                checked={form.popular}
                onChange={(e) =>
                  setForm({ ...form, popular: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="popular" className="text-gray-900 ">
                Mark as popular package
              </label>
            </div>
          </Field>



          <div className="flex justify-end gap-3 pt-4">
            <button
                  type="button"
                  onClick={() => nav("/packages")}
                className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? "Saving..." : id ? "Update Package" : "Save Package"}
                </button>
              </div>
            </form>
          </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.6rem 0.9rem;
          border: 1px solid #e5e7eb; /* light gray */
          border-radius: 0.5rem;
          background-color: #f9fafb;
          outline: none;
          transition: all 0.2s;
           font-size: 0.875rem;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
          background-color: #fff;
        }
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 0.6rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #1d4ed8;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-secondary {
          padding: 0.6rem 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          color: #374151;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
