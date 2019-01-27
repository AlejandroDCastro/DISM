
#include "cuda_runtime.h"
#include "device_launch_parameters.h"

#include <iostream>

__global__ void suma_vectores(float *a,float *b,float *c,int n) {
	int idx_ = blockIdx.x * blockDim.x + threadIdx.x;
//	c[idx_] = a[idx_] + b[idx_];

	// Ejercicios adicionales
	if(idx_ < n) {
		for (int i = idx_; i < n; i = blockDim.x * gridDim.x + i) {
			c[i] = a[i] + b[i];
		}
	}
}

int main(void) {
	const int kNumElement = 256001;
	const int kNumBytes = sizeof(float) * kNumElement;

	cudaSetDevice(0);

	// decleramos nuestros vectores y rellenarlos
	float* h_a_ = (float *)malloc(kNumBytes); // todo lo que tenga que ver con procesar, se pone h, de host
	float* h_b_ = (float *)malloc(kNumBytes);
	float* h_c_ = (float *)malloc(kNumBytes);

	// comprobamos si hay error
	if(h_a_ == NULL  ||  h_b_ == NULL  ||  h_c_ == NULL) {
		std::cerr << "Error al reservar memoria\n";
		getchar();
		exit(-1);
	}

	// rellenamos vectores
	for(int i=0; i<kNumElement; i++) {
		h_a_[i] = rand() / (float)RAND_MAX;
		h_b_[i] = rand() / (float)RAND_MAX;
	}

	// tenemos que pasar los datos de la cpu a la gpu
	float * d_a_ = NULL;
	float * d_b_ = NULL;
	float * d_c_ = NULL;

	// tenemos que decirlo cual es el puntero sobre el que inicializamos y el tamanyo de bytes
	cudaMalloc((void **)&d_a_, kNumBytes);
	cudaMalloc((void **)&d_b_, kNumBytes);
	cudaMalloc((void **)&d_c_, kNumBytes);

	// transferimos los arrays a la GPU desde la CPU
	cudaMemcpy(d_a_, h_a_, kNumBytes, cudaMemcpyHostToDevice) ;
	cudaMemcpy(d_b_, h_b_, kNumBytes, cudaMemcpyHostToDevice);

	// cuantos hilos por bloques queremos tener

	int threads_per_block_ = 256;
	int blocks_per_grid_;
	
	if(kNumElement%threads_per_block_ == 0) {
		blocks_per_grid_ = kNumElement/threads_per_block_;
	} else {
		blocks_per_grid_ = (kNumElement/threads_per_block_)+1;
	}
	
	// modificamos el tipo de datos que le gusta mas a cuda
	dim3 tpb_(threads_per_block_,1 ,1);
	dim3 bpg_(blocks_per_grid_, 1, 1);

	suma_vectores<<< bpg_, tpb_ >>>(d_a_, d_b_, d_c_,kNumElement);

	//para controlar errores
	cudaError_t err_ = cudaGetLastError();
	if(err_ != cudaSuccess)
	{
		std::cerr << "Error " << cudaGetErrorString(err_) << '\n';
		getchar();
		exit(-1);
	}

	cudaMemcpy(h_c_, d_c_, kNumBytes, cudaMemcpyDeviceToHost);

	for(int i=0; i<kNumElement; i++) {
		if(fabs(h_a_[i] + h_b_[i] - h_c_[i]) > 1e-5) {
			std::cerr << "Error en la posicion " << i << "\n";
			getchar();
			exit(-1);
		}
	}

	free(h_a_);
	free(h_b_);
	free(h_c_);

	cudaFree(d_a_);
	cudaFree(d_b_);
	cudaFree(d_c_);

	std::cout << "Optimo\n";
	getchar();
	exit(0);

}
