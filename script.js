document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("contact-form");
	const status = document.querySelector(".form__status");
	const whatsappBtn = document.getElementById("whatsapp-btn");

	// Reemplaza con tus datos reales
	const contactEmail = "leomendoza213@gmail.com";
	const whatsappNumber = "50232557454"; // Incluye código de país, sin + ni espacios

	const buildMailto = ({ name, email, message }) => {
		const subject = encodeURIComponent(`Quisera tener mas informacion sobre los servicios de BxME`);
		const body = encodeURIComponent(`\nHola BxME necesito que me ayudes con:\n${message}`);
		return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
	};

	const buildGmail = ({ name, email, message }) => {
		const subject = encodeURIComponent(`Quisera tener mas informacion sobre los servicios de BxME`);
		const body = encodeURIComponent(`Hola BxME necesito que me ayudes con:\n${message}`);
		return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${subject}&body=${body}`;
	};

	const buildWhatsapp = ({ name, message }) => {
		const text = encodeURIComponent(`Hola, soy ${name || ""}. ${message || ""}`.trim());
		return `https://wa.me/${whatsappNumber}?text=${text}`;
	};

	const showStatus = (msg, type = "info", asHTML = false) => {
		if (!status) return;
		status[asHTML ? "innerHTML" : "textContent"] = msg;
		status.style.color = type === "error" ? "#ffb4b4" : "#c7d2ff";
	};

	form?.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = new FormData(form);
		const name = formData.get("name")?.toString().trim();
		const email = formData.get("email")?.toString().trim();
		const message = formData.get("message")?.toString().trim();

		if (!name || !email || !message) {
			showStatus("Completa todos los campos para enviar el correo.", "error");
			return;
		}

		const gmailUrl = buildGmail({ name, email, message });
		const mailtoUrl = buildMailto({ name, email, message });
		showStatus("Abriendo Gmail para enviar...");
		const win = window.open(gmailUrl, "_blank");
		if (!win) {
			showStatus(
				`No pude abrir Gmail. Abre <a href="${gmailUrl}" target="_blank" rel="noopener">Gmail</a> o usa <a href="${mailtoUrl}">mailto</a>.`,
				"error",
				true
			);
		}
	});

	whatsappBtn?.addEventListener("click", () => {
		const name = form?.elements["name"]?.value.trim();
		const message = form?.elements["message"]?.value.trim();
		window.open(buildWhatsapp({ name, message }), "_blank");
	});

	// Carrusel de proyectos
	const track = document.querySelector(".carousel-track");
	const slides = Array.from(document.querySelectorAll(".carousel-slide"));
	const prevBtn = document.querySelector(".carousel-btn.prev");
	const nextBtn = document.querySelector(".carousel-btn.next");
	const dots = Array.from(document.querySelectorAll(".dot"));

	if (track && slides.length) {
		let current = 0;
		let autoplay;

		const goTo = (index) => {
			current = (index + slides.length) % slides.length;
			track.style.transform = `translateX(-${current * 100}%)`;
			slides.forEach((s, i) => s.classList.toggle("active", i === current));
			dots.forEach((d, i) => d.classList.toggle("active", i === current));
		};

		const next = () => goTo(current + 1);
		const prev = () => goTo(current - 1);

		const startAutoplay = () => {
			clearInterval(autoplay);
			autoplay = setInterval(next, 4500);
		};

		prevBtn?.addEventListener("click", () => {
			prev();
			startAutoplay();
		});

		nextBtn?.addEventListener("click", () => {
			next();
			startAutoplay();
		});

		dots.forEach((dot) => {
			dot.addEventListener("click", () => {
				const idx = Number(dot.dataset.index ?? 0);
				goTo(idx);
				startAutoplay();
			});
		});

		startAutoplay();
	}

	// Lightbox para vista ampliada del carrusel
	const buildLightbox = () => {
		const lb = document.createElement("div");
		lb.className = "lightbox";
		lb.innerHTML = `
			<button class="lightbox__close" aria-label="Cerrar vista">×</button>
			<img class="lightbox__img" alt="Vista ampliada">
		`;
		document.body.appendChild(lb);
		return lb;
	};

	const lightbox = buildLightbox();
	const lbImg = lightbox.querySelector(".lightbox__img");
	const lbClose = lightbox.querySelector(".lightbox__close");

	const openLightbox = (src, alt = "") => {
		if (!src) return;
		lbImg.src = src;
		lbImg.alt = alt;
		lightbox.classList.add("open");
		document.body.style.overflow = "hidden";
	};

	const closeLightbox = () => {
		lightbox.classList.remove("open");
		lbImg.src = "";
		document.body.style.overflow = "";
	};

	lightbox.addEventListener("click", (e) => {
		if (e.target === lightbox || e.target === lbClose) closeLightbox();
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
	});

	slides.forEach((slide) => {
		const img = slide.querySelector("img");
		img?.addEventListener("click", () => openLightbox(img.src, img.alt));
	});
});
