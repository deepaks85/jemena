import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

export default function LifeSupportForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState({
    location: "",
    retailer: "AES",
    nmi: "",
    reason: "Confirm LifeSupport",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nmi") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === "location" && value) {
        delete newErrors.location;
      }

      if (name === "nmi") {
        if (!value) {
          newErrors.nmi = "NMI is required";
        } else if (!/^\d+$/.test(value)) {
          newErrors.nmi = "Only numbers allowed";
        } else if (value.length < 10) {
          newErrors.nmi = "NMI must be exactly 10 digits";
        } else {
          delete newErrors.nmi;
        }
      }

      return newErrors;
    });
  };

  // validation
  const validate = () => {
    let err = {};

    if (!formData.location) {
      err.location = "Please select location";
    }

    if (!formData.nmi) {
      err.nmi = "NMI is required";
    } else if (!/^\d+$/.test(formData.nmi)) {
      err.nmi = "Only numbers allowed";
    } else if (formData.nmi.length !== 10) {
      err.nmi = "NMI must be exactly 10 digits";
    }

    return err;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        processType: "LIFE_SUPPORT",
        nmi: formData.nmi,
        location: formData.location,
        retailer: formData.retailer,
        reason: formData.reason,
        sourceSystem: "UI",
        notes: formData.notes,
      };

      const res = await fetch(
        "https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();

        const msg =
          errorData.reason ||
          errorData.location ||
          errorData.retailer ||
          "API validation failed";

        onError && onError(msg);
        return;
      }

      // ✅ success
      onSuccess && onSuccess("Life support request created successfully");

      // reset form
      setFormData({
        location: "",
        retailer: "AES",
        nmi: "",
        reason: "Confirm LifeSupport",
        notes: "",
      });

      setErrors({});
    } catch (err) {
      console.error(err);
      onError && onError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0">
      <Card.Body style={{ maxWidth: 800 }}>
        <Form onSubmit={handleSubmit}>
          {/* Location */}
          <Form.Group as={Row} className="mb-4">
            <Form.Label column sm={3} className="fw-semibold">
              NMI Location
            </Form.Label>
            <Col sm={9}>
              <div className="d-flex gap-4 mt-2">
                <Form.Check
                  type="radio"
                  label="AMISAP"
                  name="location"
                  value="AMISAP"
                  checked={formData.location === "AMISAP"}
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  label="SAP"
                  name="location"
                  value="SAP"
                  checked={formData.location === "SAP"}
                  onChange={handleChange}
                />
              </div>

              {errors.location && (
                <div className="text-danger pt-2 small">{errors.location}</div>
              )}
            </Col>
          </Form.Group>

          {/* Retailer */}
          <Form.Group as={Row} className="mb-4 align-items-center">
            <Form.Label column sm={3} className="fw-semibold mb-0">
              Retailer
            </Form.Label>

            <Col sm={9}>
              <Form.Select
                name="retailer"
                value={formData.retailer}
                onChange={handleChange}
              >
                <option value="AES">AES</option>
                <option value="AGL">AGL</option>
                <option value="ORIGIN">Origin</option>
              </Form.Select>
            </Col>
          </Form.Group>

          {/* NMI */}
          <Form.Group as={Row} className="mb-4">
            <Form.Label column sm={3} className="fw-semibold">
              NMI
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="nmi"
                placeholder="Enter the 10-digit NMI (numbers only)"
                value={formData.nmi}
                onChange={handleChange}
                maxLength={10}
              />

              {errors.nmi && (
                <div className="text-danger pt-2 small">{errors.nmi}</div>
              )}
            </Col>
          </Form.Group>

          {/* Reason */}
          <Form.Group as={Row} className="mb-4">
            <Form.Label column sm={3} className="fw-semibold">
              Reason
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              >
                <option value="Confirm LifeSupport">
                  Confirm Life Support
                </option>
                <option value="Data Quality Issue">Data Quality Issue</option>
                <option value="No Reponse to rejected LSN">
                  No Response to Reject LSN
                </option>
                <option value="Others">Other</option>
              </Form.Select>
            </Col>
          </Form.Group>

          {/* Notes */}
          <Form.Group as={Row} className="mb-4">
            <Form.Label column sm={3} className="fw-semibold">
              Special notes
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-100 rounded-3"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Life Support Request"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
